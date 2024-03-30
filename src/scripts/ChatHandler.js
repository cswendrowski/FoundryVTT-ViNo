import Settings from "./Settings.js";
import Logger from "./lib/Logger.js";
import QueueHandler from "./QueueHandler.js";
import CONSTANTS from "./Constants.js";
import TheatreHelpers from "./lib/theatre-helpers.js";

export default class ChatHandler {
    static commandKey = "/vino";

    static handleCreateChatMessage(message) {
        Logger.logObject(message);

        if (message.type != 2 && message.type != 3) {
            Logger.debug("Message was not Type 2 (IC) or 3 (Emote), cancelling");
            return;
        }

        if (message.flags.vino?.skip) {
            Logger.debug("Skipping message due to flag");
            return;
        }

        let speakingActor = game.actors.get(message.speaker.actor);

        try {
            if (message.speaker.token) {
                speakingActor = canvas.tokens.get(message.speaker.token).actor;
            }
        } catch (e) {
            Logger.debug("Error", e);
        }
        Logger.logObject(speakingActor);

        if (!speakingActor) {
            Logger.warn(`No actor is been found with reference`, false, message);
            return;
        }
        if (speakingActor.flags.vino?.enabled != undefined && speakingActor.flags.vino?.enabled === false) {
            Logger.warn(`Vino is not enabled by flag for actor '${speakingActor.name}'`, false);
            return;
        }
        let mood = foundry.utils.getProperty(message, `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.MOOD}`) || "";
        let img = ChatHandler._getMoodImage(speakingActor, mood);
        let messageText = message.content;
        let font = ChatHandler._getFont(speakingActor, mood);
        let preferredSide = ChatHandler._getPreferredSide(speakingActor);

        let chatDisplayData = {
            name: speakingActor.name,
            mood: mood,
            text: messageText,
            img: img,
            id: message.id,
            isEmoting: message.type == 3,
            // message: message,
            viewedScene: message.user.viewedScene,
            font: font,
            preferredSide: preferredSide,
        };

        if (message.flags.vino?.skipAutoQuote) {
            chatDisplayData.skipAutoQuote = true;
        }

        Hooks.callAll("vinoPrepareChatDisplayData", chatDisplayData);

        QueueHandler.addOrQueue(speakingActor, chatDisplayData);
    }

    static handleChatMessage(chatlog, messageText, chatData) {
        if (messageText.startsWith(ChatHandler.commandKey)) {
            let speakingActor = game.actors.get(chatData.speaker.actor);
            if (!speakingActor) {
                Logger.warn(`No actor is been selected fo the vino message`, true);
                messageText = ChatHandler._removeCommands(messageText, "");
                return false;
            }
            let mood = ChatHandler._getMood(messageText, speakingActor);

            if (mood) {
                chatData.content = ChatHandler._removeCommands(messageText, mood);
                chatData.type = 2;
                setProperty(chatData, `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.MOOD}`, mood);
                ChatMessage.create(chatData);
                Logger.logObject(chatData);
                Logger.debug("Canceling message");
                return false;
            }

            chatData.flags = {
                [CONSTANTS.MODULE_ID]: {
                    [CONSTANTS.FLAGS.MOOD]: mood,
                },
            };
            messageText = ChatHandler._removeCommands(messageText, "");
            Logger.logObject(chatData);
        }
    }

    static _getFont(actor, mood) {
        const fontByMood = foundry.utils.getProperty(
            actor,
            `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.EMOTES}.${mood}.${CONSTANTS.FLAGS.FONT}`,
        );

        var actorFont = actor.flags.vino?.font;

        const fontFounded = fontByMood ?? actorFont ?? Settings.getSync("defaultFont");

        return "100% " + fontFounded;
    }

    static _getPreferredSide(actor) {
        var preferredSide = actor.flags.vino?.preferredSide;
        if (preferredSide != undefined && preferredSide != "") {
            return preferredSide;
        }

        return "";
    }

    static _getMood(messageText, actor) {
        var matchStringTmp = messageText.toLowerCase();
        var matchStringArr = matchStringTmp.split(" ");
        var matchString = matchStringArr[0] + " " + matchStringArr[1];
        //let moods = Settings.synchronousGetDisplayableDefaultMoods();
        let moods = TheatreHelpers.getSimpleEmotes(actor);
        for (var x = 0; x < moods.length; x++) {
            var defaultMood = moods[x].key.toLowerCase();
            if (defaultMood && matchString === ChatHandler.commandKey + " " + defaultMood) {
                return defaultMood;
            }
        }
        return "";
    }

    static _getMoodImage(actor, mood) {
        Logger.logObject(actor);
        Logger.debug(mood);

        const imageByMood = foundry.utils.getProperty(
            actor,
            `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.EMOTES}.${mood}.${CONSTANTS.FLAGS.IMAGE}`,
        );
        const altdefault = foundry.utils.getProperty(
            actor,
            `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.ALT_DEFAULT}`,
        );
        /*
        if (mood != undefined && mood != "") {
            let images = actor.flags.vino?.images;

            Logger.logObject(images);

            for (var x = 0; x < Object.keys(images).length; x++) {
                let image = images[x];
                if (image == undefined) {
                    Logger.debug("ERROR - Could not get Actor flag image data!");
                    continue;
                }
                if (!image?.name) {
                    continue;
                }
                if (image.name.toLowerCase() == mood.toLowerCase()) {
                    if (image.path != "") {
                        return image.path;
                    }
                }
            }
        }
        if (actor.flags.vino?.altdefault && actor.flags.vino.altdefault != "") {
            return actor.flags.vino.altdefault;
        }
        */
        return imageByMood ?? altdefault ?? actor.img;
    }

    static _caseInsensitiveReplace(line, word, replaceWith) {
        var regex = new RegExp("(" + word + ")", "gi");
        return line.replace(regex, replaceWith);
    }

    static _removeCommands(messageText, mood) {
        messageText = ChatHandler._caseInsensitiveReplace(messageText, ChatHandler.commandKey + " " + mood, "");
        return messageText.trim();
    }
}
