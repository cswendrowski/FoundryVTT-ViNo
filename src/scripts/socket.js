import CONSTANTS from "./Constants";

export let vinoSocket;
export function registerSocket() {
    //Logger.debug("Registered vinoSocket");
    if (vinoSocket) {
        return vinoSocket;
    }

    vinoSocket = socketlib.registerModule(CONSTANTS.MODULE_ID);
    // vinoSocket.register("invokeBetterTableRollArr", (...args) => API.invokeBetterTableRollArr(...args));

    // Basic
    game.modules.get(CONSTANTS.MODULE_ID).socket = vinoSocket;
    return vinoSocket;
}
