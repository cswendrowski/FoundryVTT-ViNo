import constants from "./constants.mjs"

export default class Logger {
    static DEBUG = false;

    static log(message) {
        if (Logger.DEBUG) {
            console.log(constants.moduleName + " | " + message);
        }
    }

    static logObject(object) {
        if (Logger.DEBUG) {
            console.log(object);
        }
    }
}
