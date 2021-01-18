import LayoutDrawer from "./LayoutDrawer.mjs";
import Logger from "./Logger.mjs";
import Queue from "./Queue.mjs";

export default class QueueHandler {

    static onscreen = [];
    static queue = new Queue();
    static maxOnscreen = 4;

    static progress() {
        Logger.log("Handling Queue");
        Logger.logObject(QueueHandler.queue);
        Logger.logObject(QueueHandler.onscreen);
        if (QueueHandler.queue.isEmpty()) {
            if (QueueHandler.onscreen.length == 0) {
                Logger.log("Hiding overlay");
                $("#vino-overlay").fadeOut(1000);
            }
            return;
        };

        var data = QueueHandler.queue.dequeue();
        LayoutDrawer.addSpeakingActor(data);
    }

    static addOrQueue(speakingActor, chatDisplayData) {
        if (QueueHandler.onscreen.length <= QueueHandler.maxOnscreen && !QueueHandler.onscreen.includes(speakingActor.name)) {
            LayoutDrawer.addSpeakingActor(chatDisplayData);
        }
        else {
            QueueHandler.add(chatDisplayData);
        }
    }

    static add(element) {
        QueueHandler.queue.enqueue(element);
    }

    static remove(element) {
        QueueHandler._removeFromArray(QueueHandler.onscreen, element);
    }

    static _removeFromArray(array, element) {
        const index = array.indexOf(element);
        if (index > -1) {
            array.splice(index, 1);
        }
    }
}
