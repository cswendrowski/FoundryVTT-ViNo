import LayoutDrawer from "./LayoutDrawer.mjs";
import Logger from "./Logger.mjs";
import Queue from "./Queue.mjs";

export default class QueueHandler {

    static maxOnscreen = 8;
    static maxPerSide = 4;
    static onscreen = [];
    static leftScreen = [];
    static rightScreen = [];

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
        };

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
            }
            else if (chatDisplayData.preferredSide == "right") {
                queue = QueueHandler.rightQueue;
                max = QueueHandler.maxPerSide;
            }
        }

        if (queue.length() <= max && !QueueHandler.onscreen.includes(speakingActor.name)) {
            Logger.log("Adding");
            LayoutDrawer.addSpeakingActor(chatDisplayData);     
        }
        else {
            Logger.log("Queuing");
            QueueHandler.add(chatDisplayData);
        }
    }

    static add(element) {
        if (element.preferredSide == undefined || element.preferredSide == "") {
            QueueHandler.generalQueue.enqueue(element);
        }
        else if (element.preferredSide == "left") {
            QueueHandler.leftQueue.enqueue(element);
        }
        else if (element.preferredSide == "right") {
            QueueHandler.rightQueue.enqueue(element);
        }
        else {
            Logger.log("ERROR - Unknown state for adding element");
            Logger.logObject(element);
        }
    }

    static removeOnscreen(element) {
        QueueHandler._removeFromArray(QueueHandler.onscreen, element);
    }

    static _removeFromArray(array, element) {
        const index = array.indexOf(element);
        if (index > -1) {
            array.splice(index, 1);
        }
    }
}
