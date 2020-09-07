import VNOverlay from './apps/VNOverlay.js';
import Queue from "./scripts/Queue.js";
import { Settings } from "./settings.js";
// eslint-disable-next-line no-unused-vars
import constants from './constants.js';
//import TextPlugin from "./greensock/dist/plugins/TextPlugin.min.js";

(() => { })();

Hooks.once('init', async () => {

});

let DEBUG = true;
let DEBUGGING_LAYOUT = false;
let secondsPerWord = 1.0;
let animatedSecondsPerWord = 0.3;
let minimumTimeOnscreen = 5;
let timeBetweenScrolling = 0.5;
let onscreen = [];
let queue = new Queue();
let maxOnscreen = 4;
let commandKey = "!";

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

Hooks.once('ready', async function() {
  Settings.registerSettings();

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

  let mood = getMood(message.data.content);
  let img = getMoodImage(speakingActor, mood);

  if (onscreen.length <= maxOnscreen && !onscreen.includes(speakingActor.name)) {
    addSpeakingActor(speakingActor.name, mood, removeCommands(message.data.content), img, message.data._id);
  }
  else {
    queue.enqueue({name: speakingActor.name, mood: mood, text: removeCommands(message.data.content), img: img, id: message.data._id});
  }
});

// Hooks.on("chatMessage", (chatLog, messageText, chatData) => {
//   return false;
// });

function getMoodImage(actor, mood)
{
  logObject(actor);

  if (mood == "mad" && actor.data.data.attributes.madimg) {
    return actor.data.data.attributes.madimg;
  }
  if (mood == "sad" && actor.data.data.attributes.sadimg) {
    return actor.data.data.attributes.sadimg;
  }
  if (mood == "joy" && actor.data.data.attributes.joyimg) {
    return actor.data.data.attributes.joyimg;
  }
  if (mood == "fear" && actor.data.data.attributes.fearimg) {
    return actor.data.data.attributes.fearimg;
  }

  if (actor.data.data.attributes.altdefault) {
    return actor.data.data.attributes.altdefault;
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

function addSpeakingActor(actorName, mood, text, img, id)
{
  var previousLength = onscreen.length;
  onscreen.push(actorName);
  log("Appending " + actorName);

  let html = `<div id="${id}" class="vino-chat-frame" style="display:none;">`;
  html +=   `<img src="${img}" class="vino-chat-actor-portrait" />`;
  html +=   `<div class="vino-chat-flexy-boi">`;
  html +=   `  <div class="vino-chat-body">`
  html +=   `    <div class="vino-chat-actor-name">${actorName}</div>`;
  html +=   `    <div class="vino-chat-emotion-flare">${mood}</div>`;
  html +=   `    <div id="${id}-vino-chat-text-body" class="vino-chat-text-body">`;
  html +=   `      <p id="${id}-vino-chat-text-paragraph"></p>`;
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
  $("#" + id + ".vino-chat-frame").fadeIn(500);

  log("Appended " + actorName);


  TweenLite.to(`#${id}-vino-chat-text-paragraph`, wordCount(text) * animatedSecondsPerWord, { text: { value: `"${text}"`, delimiter:"" }, ease: Linear.easeIn });

  var scrollFn = setInterval(function(){
    TweenLite.to(`#${id}-vino-chat-text-body`, timeBetweenScrolling / 1000, { scrollTo: "max" });
  }, timeBetweenScrolling * 1000);
  
  var timeout = wordCount(text) * (1000 * secondsPerWord);
  if (timeout < (minimumTimeOnscreen * 1000)) {
    timeout = (minimumTimeOnscreen * 1000);
  }

  if (!DEBUGGING_LAYOUT) {
    setTimeout(function(){
      clearInterval(scrollFn);
      let frame = $("#" + id + ".vino-chat-frame");
      //TweenLite.to(`#${id}-vino-chat-text-paragraph`, 1, {text:{value:``, delimiter:""}, ease:Linear.easeNone});
      frame.fadeOut(1000, function() {
        frame.remove();
        removeFromArray(onscreen, actorName);
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
  addSpeakingActor(data.name, data.mood, data.text, data.img, data.id);
}

class ActorPortraitSheet extends ActorSheet {
  get template() {
    return "modules/vino/templates/actor-portraits.html";
  }

  getData() {
    const sheetData = super.getData();

    if (sheetData.actor.data.attributes.altdefault == undefined) {
      sheetData.actor.data.attributes.altdefault = "";
    }
    if (sheetData.actor.data.attributes.madimg == undefined) {
      sheetData.actor.data.attributes.madimg = "";
    }
    if (sheetData.actor.data.attributes.sadimg == undefined) {
      sheetData.actor.data.attributes.sadimg = "";
    }
    if (sheetData.actor.data.attributes.joyimg == undefined) {
      sheetData.actor.data.attributes.joyimg = "";
    }
    if (sheetData.actor.data.attributes.fearimg == undefined) {
      sheetData.actor.data.attributes.fearimg = "";
    }

    return sheetData;
  }
}


Actors.registerSheet("VINO", ActorPortraitSheet, {
  types: [],
  makeDefault: false
});
