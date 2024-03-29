import LayoutDrawer from "./LayoutDrawer.js";
import Logger from "./lib/Logger.js";
import Queue from "./Queue.js";

export default class QueueHandler {
  static maxOnscreen = 8;
  static maxPerSide = 4;
  static onscreen = [];
  static leftScreen = {
    M1: undefined,
    M2: undefined,
    T1: undefined,
    T2: undefined,
  };
  static rightScreen = {
    M1: undefined,
    M2: undefined,
    T1: undefined,
    T2: undefined,
  };

  static leftQueue = new Queue();
  static rightQueue = new Queue();
  static generalQueue = new Queue();

  static progress() {
    Logger.log("Handling Queue");
    Logger.logObject(QueueHandler.generalQueue);
    Logger.logObject(QueueHandler.leftQueue);
    Logger.logObject(QueueHandler.rightQueue);
    Logger.logObject(QueueHandler.onscreen);

    if (QueueHandler.generalQueue.isEmpty() && QueueHandler.leftQueue.isEmpty() && QueueHandler.rightQueue.isEmpty()) {
      if (QueueHandler.onscreen.length == 0) {
        Logger.log("Hiding overlay");
        $("#vino-overlay").fadeOut(1000);
      }
      return;
    }

    var data = QueueHandler.generalQueue.dequeue();
    LayoutDrawer.addSpeakingActor(data);
  }

  static addOrQueue(speakingActor, chatDisplayData) {
    Logger.log("Adding or Queuing");
    Logger.logObject(chatDisplayData);
    let queue = QueueHandler.generalQueue;
    let max = QueueHandler.maxOnscreen;

    if (chatDisplayData.preferredSide != undefined && chatDisplayData.preferredSide != "") {
      if (chatDisplayData.preferredSide == "left") {
        queue = QueueHandler.leftQueue;
        max = QueueHandler.maxPerSide;
      } else if (chatDisplayData.preferredSide == "right") {
        queue = QueueHandler.rightQueue;
        max = QueueHandler.maxPerSide;
      }
    }

    if (queue.length() <= max && !QueueHandler.onscreen.includes(speakingActor.name)) {
      Logger.log("Adding");
      LayoutDrawer.addSpeakingActor(chatDisplayData);
    } else {
      Logger.log("Queuing");
      QueueHandler.add(chatDisplayData);
    }
  }

  static add(element) {
    if (element.preferredSide == undefined || element.preferredSide == "") {
      QueueHandler.generalQueue.enqueue(element);
    } else if (element.preferredSide == "left") {
      QueueHandler.leftQueue.enqueue(element);
    } else if (element.preferredSide == "right") {
      QueueHandler.rightQueue.enqueue(element);
    } else {
      Logger.error("Unknown state for adding element");
      Logger.errorObject(element);
    }
  }

  static removeOnscreen(element) {
    QueueHandler._removeFromArray(QueueHandler.onscreen, element);
    QueueHandler._removeFromOnscreen(QueueHandler.leftScreen, element);
    QueueHandler._removeFromOnscreen(QueueHandler.rightScreen, element);
  }

  static _removeFromOnscreen(onscreen, element) {
    if (onscreen.M1 == element) onscreen.M1 = undefined;
    else if (onscreen.M2 == element) onscreen.M2 = undefined;
    else if (onscreen.T1 == element) onscreen.T1 = undefined;
    else if (onscreen.T2 == element) onscreen.T2 = undefined;
  }

  static _removeFromArray(array, element) {
    const index = array.indexOf(element);
    if (index > -1) {
      array.splice(index, 1);
    }
  }
}
