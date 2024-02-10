import Settings from "./Settings.mjs";
import Logger from "./Logger.mjs";
import QueueHandler from "./QueueHandler.mjs";

export default class ChatHandler {
  static commandKey = "/";

  static handleCreateChatMessage(message) {
    Logger.logObject(message);

    if (message.type != 2 && message.type != 3) {
      Logger.log("Message was not Type 2 (IC) or 3 (Emote), cancelling");
      return;
    }

    if (message.flags.vino?.skip) {
        Logger.log("Skipping message due to flag");
        return;
    }

    let speakingActor = game.actors.get(message.speaker.actor);

    try {
      if (message.speaker.token) {
        speakingActor = canvas.tokens.get(message.speaker.token).actor;
      }
    } catch {}
    Logger.logObject(speakingActor);

    if (!speakingActor) return;

    if (speakingActor.flags.vino?.enabled != undefined && speakingActor.flags.vino?.enabled === false) return;

    let mood = message.flags.vino?.mood;
    if (mood == undefined) mood = "";
    let img = ChatHandler._getMoodImage(speakingActor, mood);
    let text = message.content;
    let font = ChatHandler._getFont(speakingActor);
    let preferredSide = ChatHandler._getPreferredSide(speakingActor);

    let chatDisplayData = {
      name: speakingActor.name,
      mood: mood,
      text: text,
      img: img,
      id: message.id,
      isEmoting: message.type == 3,
      message: message,
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
    let mood = ChatHandler._getMood(messageText);
    if (mood != "") {
      chatData.content = ChatHandler._removeCommands(messageText, mood);
      chatData.type = 2;
      setProperty(chatData, "flags.vino.mood", mood);
      ChatMessage.create(chatData);
      Logger.logObject(chatData);
      Logger.log("Canceling message");
      return false;
    }

    chatData.flags = {
      vino: {
        mood: "",
      },
    };
    Logger.logObject(chatData);
  }

  static _getFont(actor) {
    var actorFont = actor.flags.vino?.font;
    if (actorFont != undefined && actorFont != "") {
      return "100% " + actorFont;
    }

    return "100% " + Settings.getSync("defaultFont");
  }

  static _getPreferredSide(actor) {
    var preferredSide = actor.flags.vino?.preferredSide;
    if (preferredSide != undefined && preferredSide != "") {
      return preferredSide;
    }

    return "";
  }

  static _getMood(messageText) {
    var matchString = messageText.toLowerCase();

    let moods = Settings.synchronousGetDisplayableDefaultMoods();

    for (var x = 0; x < moods.length; x++) {
      var defaultMood = moods[x].toLowerCase();
      if (defaultMood != "" && matchString.startsWith(ChatHandler.commandKey + defaultMood)) {
        return defaultMood;
      }
    }
    return "";
  }

  static _getMoodImage(actor, mood) {
    Logger.logObject(actor);
    Logger.log(mood);

    if (mood != undefined && mood != "") {
      let images = actor.flags.vino?.images;

      Logger.logObject(images);

      for (var x = 0; x < Object.keys(images).length; x++) {
        let image = images[x];
        if (image == undefined) {
          Logger.log("ERROR - Could not get Actor flag image data!");
          continue;
        }
        if (!image?.name) continue;
        if (image.name.toLowerCase() == mood.toLowerCase()) {
          if (image.path != "") return image.path;
        }
      }
    }

    if (actor.flags.vino?.altdefault && actor.flags.vino.altdefault != "") {
      return actor.flags.vino.altdefault;
    }

    return actor.img;
  }

  static _caseInsensitiveReplace(line, word, replaceWith) {
    var regex = new RegExp("(" + word + ")", "gi");
    return line.replace(regex, replaceWith);
  }

  static _removeCommands(messageText, mood) {
    messageText = ChatHandler._caseInsensitiveReplace(messageText, ChatHandler.commandKey + mood, "");

    return messageText.trim();
  }
}
