import { gsap, ScrollToPlugin, TextPlugin } from "/scripts/greensock/esm/all.js";
import VNOverlay from './apps/VNOverlay.js';
import ActorConfiguration from './apps/ActorConfiguration.js';
import Queue from "./scripts/Queue.js";
import { Settings } from "./settings.js";

(() => { })();


let DEBUG = false;
let DEBUGGING_LAYOUT = false;
let secondsPerWord = 0.5;
let animatedSecondsPerWord = 0.3;
let minimumTimeOnscreen = 5;
let timeBetweenScrolling = 0.5;
let onscreen = [];
let queue = new Queue();
let maxOnscreen = 4;
let commandKey = "/";

function log(message) {
    if (DEBUG) {
        console.log("VINO | " + message);
    }
}

function logObject(object) {
    if (DEBUG) {
        console.log(object);
    }
}

Hooks.on('renderActorSheet', function(sheet, html, data) {

  let configureSheet = html.find('.configure-sheet');

  if (configureSheet.length == 0) {
    html.find('.close').before('<a class="configure-vino"><i class="fas fa-address-book"></i>ViNo</a>');
  }
  else {
    configureSheet.before('<a class="configure-vino"><i class="fas fa-address-book"></i>ViNo</a>');
  }
  
  
  html.find(".configure-vino").click(event => { 
    let actorId = data.actor._id;
    let configurationApp = new ActorConfiguration(actorId);
    configurationApp.render(true);
  });
});

Hooks.once('ready', async function() {
  Settings.registerSettings();

  gsap.registerPlugin(ScrollToPlugin, TextPlugin);

  DEBUG = Settings.get("debugMode");
  if (!DEBUG) {
    DEBUGGING_LAYOUT = false;
  }
  secondsPerWord = Settings.get("secondsPerWord");
  animatedSecondsPerWord = Settings.get("animatedSecondsPerWord");
  minimumTimeOnscreen = Settings.get("minimumTimeOnScreen");
  timeBetweenScrolling = Settings.get("timeBetweenScrolling");
  maxOnscreen = Settings.get("maxOnScreen");
  commandKey = Settings.get("commandKey");
});

Hooks.once('canvasReady', async () => {
  ui.vinoOverlay = new VNOverlay();

  ui.vinoOverlay.render(true);
  $("#vino-overlay").fadeOut();
});

Hooks.on("createChatMessage", function(message) {
  logObject(message);

  if (message.data.type != 2 && message.data.type != 3) {
    log("Message was not Type 2 (IC) or 3 (Emote), cancelling");
    return;
  }

  let speakingActor = game.actors.get(message.data.speaker.actor);
  logObject(speakingActor);

  if (!speakingActor) return;

  let mood = message.data.flags.vino.mood;
  let img = getMoodImage(speakingActor, mood);
  let text = message.data.content;
  let font = getFont(speakingActor);

  let chatDisplayData = {
    name: speakingActor.name,
    mood: mood, 
    text: text, 
    img: img, 
    id: message.data._id, 
    isEmoting: message.data.type == 3,
    message: message,
    font: font
  };

  Hooks.callAll("vinoPrepareChatDisplayData", chatDisplayData);

  if (onscreen.length <= maxOnscreen && !onscreen.includes(speakingActor.name)) {
    addSpeakingActor(chatDisplayData);
  }
  else {
    queue.enqueue(chatDisplayData);
  }
});

Hooks.on("chatMessage", (chatLog, messageText, chatData) => {
  let mood = getMood(messageText);
  if (mood != "") {
    chatData.content = removeCommands(messageText);
    chatData.type = 2;
    setProperty(chatData, 'flags.vino.mood', mood);
    ChatMessage.create(chatData);
    return false;
  }

  chatData.flags = {
    vino: {
      mood: ""
    }
  };
});

function getFont(actor) {
  var actorFont = actor.data.flags.vino?.font;
  if (actorFont != undefined && actorFont != "") {
    return "100% " + actorFont;
  }

  return "100% " + Settings.get("defaultFont");
}

function getMoodImage(actor, mood)
{
  logObject(actor);
  log(mood);

  if (mood != undefined && mood != "") {
    let images = actor.data.flags.vino.images;
    logObject(images);

    for (var x = 0; x < Object.keys(images).length; x++) {
      let image = images[x];
      if (image.name.toLowerCase() == mood.toLowerCase()) {
        if (image.path != "") return image.path;
      }
    }
  }

  if (actor.data.flags.vino?.altdefault && actor.data.flags.vino.altdefault != "") {
    return actor.data.flags.vino.altdefault;
  }

  return actor.img;
}

function getMood(messageText) {

  var matchString = messageText.toLowerCase();

  for (var x = 1; x <= Settings.getMaxDefaultMoods(); x++) {
    var defaultMood = Settings.getDefaultMood(x).toLowerCase();
    if (defaultMood == "<DELETED>") continue;
    if (defaultMood != "" && matchString.startsWith(commandKey + defaultMood)) {
      return defaultMood;
    }
   }

  return "";
}

function caseInsensitiveReplace(line, word, replaceWith) {
  var regex = new RegExp( '(' + word + ')', 'gi' );
  return line.replace( regex, replaceWith );
}

function removeCommands(messageText) {

  for (var x = 1; x <= Settings.getMaxDefaultMoods(); x++) {
    var defaultMood = Settings.getDefaultMood(x);
    if (defaultMood == "<DELETED>") continue;
    if (defaultMood != "") {
      messageText = caseInsensitiveReplace(messageText, commandKey + defaultMood, "");
    }
   }

   return messageText.trim();
}

function removeExtraneousHtml(messageText) {

  messageText = caseInsensitiveReplace(messageText, "<p>", "");
  messageText = caseInsensitiveReplace(messageText, "</p>", "");

  return messageText.trim();
}

function wordCount(str) { 
  return str.split(" ").length;
}

function removeFromArray(array, element) {
  const index = array.indexOf(element);
  if (index > -1) {
    array.splice(index, 1);
  }
}

function addSpeakingActor(chatDisplayData)
{
  var previousLength = onscreen.length;
  onscreen.push(chatDisplayData.name);
  log("Appending " + chatDisplayData.name);

  let html = `<div id="V${chatDisplayData.id}" class="vino-chat-frame" style="display:none;">`;
  html +=   `<img src="${chatDisplayData.img}" class="vino-chat-actor-portrait" />`;
  html +=   `<div class="vino-chat-flexy-boi">`;
  html +=   `  <div class="vino-chat-body">`
  html +=   `    <div class="vino-chat-actor-name">${chatDisplayData.name}</div>`;
  html +=   `    <div class="vino-chat-emotion-flare">${chatDisplayData.mood}</div>`;
  html +=   `    <div id="V${chatDisplayData.id}-vino-chat-text-body" class="vino-chat-text-body">`;
  html +=   `      <p id="V${chatDisplayData.id}-vino-chat-text-paragraph" style="font: ${chatDisplayData.font}"></p>`;
  html +=   `    </div>`;
  html +=   `  </div>`;
  html +=   `</div>`;
  html +=   `</div>`;

  $("#vino-chat-lane")
    .append(html);

  if (previousLength == 0) {
    log("Showing vino overlay");
    $("#vino-overlay").fadeIn(500);
  }
  $("#V" +chatDisplayData.id + ".vino-chat-frame").fadeIn(500);

  log("Appended " + chatDisplayData.name);

  chatDisplayData.text = removeExtraneousHtml(chatDisplayData.text);

  if (chatDisplayData.isEmoting) {
    chatDisplayData.text = `<i>${chatDisplayData.text}</i>`;
  }
  else if (chatDisplayData.skipAutoQuote)
  { 
    log("Skipping autoquote");
  }
  else if (Settings.get('autoQuote')) {
    chatDisplayData.text = `${Settings.get('quoteOpening')}${chatDisplayData.text}${Settings.get('quoteClosing')}`;
  }

  gsap.to(`#V${chatDisplayData.id}-vino-chat-text-paragraph`, wordCount(chatDisplayData.text) * animatedSecondsPerWord, { text: { value: `${chatDisplayData.text}`, delimiter:"" }, ease: "none" });

  var scrollFn = setInterval(function(){
    gsap.to(`#V${chatDisplayData.id}-vino-chat-text-body`, timeBetweenScrolling / 1000, { scrollTo: "max" });
  }, timeBetweenScrolling * 1000);
  
  var timeout = wordCount(chatDisplayData.text) * (1000 * secondsPerWord);
  if (timeout < (minimumTimeOnscreen * 1000)) {
    timeout = (minimumTimeOnscreen * 1000);
  }

  if (!DEBUGGING_LAYOUT) {
    setTimeout(function(){
      clearInterval(scrollFn);
      let frame = $("#V" + chatDisplayData.id + ".vino-chat-frame");
      frame.fadeOut(1000, function() {
        frame.remove();
        removeFromArray(onscreen, chatDisplayData.name);
        handleQueue();
      });
    }, timeout);
  }
}

function handleQueue() {
  log("Handling Queue");
  logObject(queue);
  logObject(onscreen);
  if (queue.isEmpty()) {
    if (onscreen.length == 0) {
      log("Hiding overlay");
      $("#vino-overlay").fadeOut(1000);
    }
    return;
  };

  var data = queue.dequeue();
  addSpeakingActor(data);
}
