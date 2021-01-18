import { gsap, ScrollToPlugin, TextPlugin } from "/scripts/greensock/esm/all.js";
import VNOverlay from './apps/VNOverlay.mjs';
import ActorConfiguration from './apps/ActorConfiguration.mjs';
import Settings from "./scripts/Settings.mjs";
import ChatHandler from "./scripts/ChatHandler.mjs";
import LayoutHandler from "./scripts/LayoutDrawer.mjs";
//import QueueHandler from "./scripts/QueueHandler.mjs";
import Logger from "./scripts/Logger.mjs";

//import TextPlugin from "./greensock/dist/plugins/TextPlugin.min.js";

(() => { })();

Hooks.once('init', async () => {

});

let DEBUG = true;
let DEBUGGING_LAYOUT = true;
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
  await Settings.registerSettings();

  gsap.registerPlugin(ScrollToPlugin, TextPlugin);

  Logger.DEBUG = await Settings.get("debugMode");;

  ChatHandler.commandKey = await Settings.get("commandKey");

  LayoutHandler.secondsPerWord = await Settings.get("secondsPerWord");
  LayoutHandler.animatedSecondsPerWord = await Settings.get("animatedSecondsPerWord");
  LayoutHandler.minimumTimeOnscreen = await Settings.get("minimumTimeOnScreen");
  LayoutHandler.timeBetweenScrolling = await Settings.get("timeBetweenScrolling");

  if (!Logger.DEBUG) {
    LayoutHandler.DEBUGGING_LAYOUT = false;
  }

  //QueueHandler.maxOnscreen = await Settings.get("maxOnscreen");

  Handlebars.registerHelper('isdefined', function (value) {
    return value !== undefined && value !== null;
  });

  Settings._scheduleRefresh();
});

Hooks.once('canvasReady', async () => {
  ui.vinoOverlay = new VNOverlay();
 
  ui.vinoOverlay.render(true);
  $("#vino-overlay").fadeOut();
});

Hooks.on("createChatMessage", ChatHandler.handleCreateChatMessage);
Hooks.on("chatMessage", ChatHandler.handleChatMessage);
