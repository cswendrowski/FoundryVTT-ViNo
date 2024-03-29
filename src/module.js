import VNOverlay from "./scripts/apps/VNOverlay.js";
import ActorConfiguration from "./scripts/apps/ActorConfiguration.js";
import Settings from "./scripts/Settings.js";
import ChatHandler from "./scripts/ChatHandler.js";
import LayoutHandler from "./scripts/LayoutDrawer.js";
import QueueHandler from "./scripts/QueueHandler.js";
import Logger from "./scripts/lib/Logger.js";
import CONSTANTS from "./scripts/Constants.js";
import {registerSocket} from "./scripts/socket.js"


Hooks.once("ready", async function () {
  await Settings.registerSettings();

  gsap.registerPlugin(ScrollToPlugin, TextPlugin);

  ChatHandler.commandKey = await Settings.get("commandKey");

  LayoutHandler.secondsPerWord = await Settings.get("secondsPerWord");
  LayoutHandler.animatedSecondsPerWord = await Settings.get("animatedSecondsPerWord");
  LayoutHandler.minimumTimeOnscreen = await Settings.get("minimumTimeOnScreen");
  LayoutHandler.timeBetweenScrolling = await Settings.get("timeBetweenScrolling");

  if (!Logger.DEBUG) {
    LayoutHandler.DEBUGGING_LAYOUT = false;
  }

  //QueueHandler.maxOnscreen = await Settings.get("maxOnScreen");

  Handlebars.registerHelper("isdefined", function (value) {
    return value !== undefined && value !== null;
  });

  Settings._scheduleRefresh();
});

/* ------------------------------------ */
/* Other Hooks */
/* ------------------------------------ */


Hooks.once("devModeReady", ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(CONSTANTS.MODULE_ID);
});

Hooks.once("socketlib.ready", () => {
    registerSocket();
});


Hooks.on("renderActorSheet", function (sheet, html, data) {
    let configureSheet = html.find(".configure-sheet");

    if (configureSheet.length == 0) {
      html.find(".close").before('<a class="configure-vino"><i class="fas fa-address-book"></i>ViNo</a>');
    } else {
      configureSheet.before('<a class="configure-vino"><i class="fas fa-address-book"></i>ViNo</a>');
    }

    html.find(".configure-vino").click((event) => {
      let configurationApp = new ActorConfiguration(sheet.actor);
      configurationApp.render(true);
    });
});

Hooks.once("canvasReady", async () => {
  ui.vinoOverlay = new VNOverlay();

  ui.vinoOverlay.render(true);
  $("#vino-overlay").fadeOut();
});

Hooks.on("createChatMessage", ChatHandler.handleCreateChatMessage);
Hooks.on("chatMessage", ChatHandler.handleChatMessage);
