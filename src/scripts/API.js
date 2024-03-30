import ChatHandler from "./ChatHandler";
import CONSTANTS from "./Constants";
import Logger from "./lib/Logger";
import { RetrieveHelpers } from "./lib/retrieve-helpers";
import QueueHandler from "./QueueHandler";

const API = {
    /**
     * @param {Actor/Token/string} tokenOrActor
     * @param {string} content
     * @param {Object} options
     * @param {string} [options.id]
     * @param {string} [options.name]
     * @param {string} [options.img]
     * @param {string} [options.text]
     * @param {string} [options.viewedScene]
     * @param {('left'|'right')} [options.preferredSide]
     * @param {string} [options.mood]
     * @param {string} [options.font]
     * @param {boolean} [options.isEmoting]
     * @param {boolean} [options.skipAutoQuote]
     * @returns {void}
     */
    async showDialogActor(tokenOrActor, content, options) {
        let speakingActor = undefined;
        let sceneViewedId = undefined;
        let nameTmp = "";
        let imgTmp = "";
        let idTmp = "";
        let enabled = false;
        const tokenTmp = RetrieveHelpers.getTokenSync(tokenOrActor, true);
        if (tokenTmp) {
            speakingActor = tokenTmp.actor;
            if (!speakingActor) {
                Logger.warn(`No actor is been found with reference`, true, tokenOrActor);
                return;
            }
            sceneViewedId = tokenTmp.scene.id;
            nameTmp = tokenTmp.name;
            imgTmp = options.img ?? ChatHandler._getMoodImage(speakingActor, mood) ?? tokenTmp.img;
            idTmp = tokenTmp.uuid;
            enabled = foundry.utils.getProperty(
                speakingActor,
                `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.ENABLED}`,
            );
        } else {
            speakingActor = await RetrieveHelpers.getActorAsync(tokenOrActor, true);
            if (!speakingActor) {
                Logger.warn(`No actor is been found with reference`, true, tokenOrActor);
                return;
            }
            sceneViewedId = game.scenes.viewed.id ?? game.users.get(game.user.id).viewedScene;
            nameTmp = speakingActor.name;
            imgTmp = options.img ?? ChatHandler._getMoodImage(speakingActor, mood) ?? speakingActor.img;
            idTmp = speakingActor.uuid;
            enabled = foundry.utils.getProperty(
                speakingActor,
                `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.ENABLED}`,
            );
        }

        Logger.logObject(speakingActor);

        if (!enabled) {
            Logger.warn(`Vino is not enabled by flag for actor '${speakingActor.name}'`, false);
            return;
        }

        let mood = "";
        let font = ChatHandler._getFont(speakingActor, mood); // TODO add theatre integration
        let preferredSide = ChatHandler._getPreferredSide(speakingActor); // TODO add theatre integration
        let textTmp = options.text || content || "";

        let currentOptions = {
            name: nameTmp,
            mood: "",
            text: textTmp,
            img: imgTmp,
            id: idTmp,
            isEmoting: false,
            // message: message,
            viewedScene: message.user.viewedScene,
            font: font || "",
            preferredSide: preferredSide || "",
            skipAutoQuote: true,
        };

        const chatDisplayData = foundry.utils.mergeObject(currentOptions, options);

        Hooks.callAll("vinoPrepareChatDisplayData", chatDisplayData);

        QueueHandler.addOrQueue(speakingActor, chatDisplayData);
    },

    // =============================================
    // SOCKET SUPPORT
    // ============================================

    //   async pullPlayerToSceneArr(...inAttributes) {
    //     if (!Array.isArray(inAttributes)) {
    //       throw error("pullToSceneArr | inAttributes must be of type array");
    //     }
    //     const [sceneId, userId] = inAttributes;
    //     await game.socket?.emit("pullToScene", sceneId, userId);
    //   },
};

export default API;
