import { gsap, ScrollToPlugin, TextPlugin } from "/scripts/greensock/esm/all.js";
import VNOverlay from './apps/VNOverlay.js';
import ActorConfiguration from './apps/ActorConfiguration.js';
import Queue from "./scripts/Queue.js";
import { Settings } from "./settings.js";
// eslint-disable-next-line no-unused-vars
import constants from './constants.js';

//import TextPlugin from "./greensock/dist/plugins/TextPlugin.min.js";

(() => { })();

Hooks.once('init', async () => {

});

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
  html.find('.configure-sheet').before('<a class="configure-vino"><i class="fas fa-address-book"></i>ViNo</a>');
  
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
});

Hooks.once('canvasReady', async () => {
  ui.vinoOverlay = new VNOverlay();

   ui.vinoOverlay.render(true);

  $("#vino-overlay").fadeOut(0);
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
  var actorFont = actor.data.data.vino.font;
  if (actorFont != undefined && actorFont != "") {
    return "100% " + actorFont;
  }

  return "100% " + Settings.get("defaultFont");
}

function getMoodImage(actor, mood)
{
  logObject(actor);

  if (mood == "mad" && actor.data.data.vino.madimg) {
    return actor.data.data.vino.madimg;
  }
  if (mood == "sad" && actor.data.data.vino.sadimg) {
    return actor.data.data.vino.sadimg;
  }
  if (mood == "joy" && actor.data.data.vino.joyimg) {
    return actor.data.data.vino.joyimg;
  }
  if (mood == "fear" && actor.data.data.vino.fearimg) {
    return actor.data.data.vino.fearimg;
  }

  if (actor.data.data.vino.altdefault) {
    return actor.data.data.vino.altdefault;
  }

  return actor.img;
}

function getMood(messageText) {
  if (messageText.toLowerCase().startsWith(commandKey + "mad")) return "mad";
  if (messageText.toLowerCase().startsWith(commandKey + "sad")) return "sad";
  if (messageText.toLowerCase().startsWith(commandKey + "joy")) return "joy";
  if (messageText.toLowerCase().startsWith(commandKey + "fear")) return "fear";

  return "";
}

function caseInsensitiveReplace(line, word, replaceWith) {
  var regex = new RegExp( '(' + word + ')', 'gi' );
  return line.replace( regex, replaceWith );
}

function removeCommands(messageText) {

  messageText = caseInsensitiveReplace(messageText, commandKey + "mad", "");
  messageText = caseInsensitiveReplace(messageText, commandKey + "sad", "");
  messageText = caseInsensitiveReplace(messageText, commandKey + "joy", "");
  messageText = caseInsensitiveReplace(messageText, commandKey + "fear", "");

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

  let html = `<div id="${chatDisplayData.id}" class="vino-chat-frame" style="display:none;">`;
  html +=   `<img src="${chatDisplayData.img}" class="vino-chat-actor-portrait" />`;
  html +=   `<div class="vino-chat-flexy-boi">`;
  html +=   `  <div class="vino-chat-body">`
  html +=   `    <div class="vino-chat-actor-name">${chatDisplayData.name}</div>`;
  html +=   `    <div class="vino-chat-emotion-flare">${chatDisplayData.mood}</div>`;
  html +=   `    <div id="${chatDisplayData.id}-vino-chat-text-body" class="vino-chat-text-body">`;
  html +=   `      <p id="${chatDisplayData.id}-vino-chat-text-paragraph" style="font: ${chatDisplayData.font}"></p>`;
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
  $("#" +chatDisplayData.id + ".vino-chat-frame").fadeIn(500);

  log("Appended " + chatDisplayData.name);

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

  gsap.to(`#${chatDisplayData.id}-vino-chat-text-paragraph`, wordCount(chatDisplayData.text) * animatedSecondsPerWord, { text: { value: `${chatDisplayData.text}`, delimiter:"" }, ease: "none" });

  var scrollFn = setInterval(function(){
    gsap.to(`#${chatDisplayData.id}-vino-chat-text-body`, timeBetweenScrolling / 1000, { scrollTo: "max" });
  }, timeBetweenScrolling * 1000);
  
  var timeout = wordCount(chatDisplayData.text) * (1000 * secondsPerWord);
  if (timeout < (minimumTimeOnscreen * 1000)) {
    timeout = (minimumTimeOnscreen * 1000);
  }

  if (!DEBUGGING_LAYOUT) {
    setTimeout(function(){
      clearInterval(scrollFn);
      let frame = $("#" + chatDisplayData.id + ".vino-chat-frame");
      //gsap.to(`#${id}-vino-chat-text-paragraph`, 1, {text:{value:``, delimiter:""}, ease:Linear.easeNone});
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
