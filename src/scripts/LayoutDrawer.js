import Settings from "./Settings.js";
import Logger from "./lib/Logger.js";
import QueueHandler from "./QueueHandler.js";
import ChatHandler from "./ChatHandler.js";

export default class LayoutDrawer {
  static DEBUGGING_LAYOUT = false;
  static secondsPerWord = 0.5;
  static animatedSecondsPerWord = 0.3;
  static minimumTimeOnscreen = 5;
  static timeBetweenScrolling = 0.5;

  static async addSpeakingActor(chatDisplayData) {
    if (await Settings.get("restrictVinoToSameScene")) {
      if (chatDisplayData.message.user.viewedScene != game.user.viewedScene) return;
    }

    var previousLength = QueueHandler.onscreen.length;
    QueueHandler.onscreen.push(chatDisplayData.name);

    let columnIdentifier = "ERROR";
    let row = 0;
    let column = 0;

    if (chatDisplayData.preferredSide != undefined && chatDisplayData.preferredSide != "") {
      if (chatDisplayData.preferredSide == "left") {
        columnIdentifier = "L";
        if (QueueHandler.leftScreen.M1 == undefined) {
          row = 0;
          column = 0;
          QueueHandler.leftScreen.M1 = chatDisplayData.name;
        } else if (QueueHandler.leftScreen.M2 == undefined) {
          row = 0;
          column = 1;
          QueueHandler.leftScreen.M2 = chatDisplayData.name;
        } else if (QueueHandler.leftScreen.T1 == undefined) {
          row = 1;
          column = 0;
          QueueHandler.leftScreen.T1 = chatDisplayData.name;
        } else if (QueueHandler.leftScreen.T2 == undefined) {
          row = 1;
          column = 1;
          QueueHandler.leftScreen.T2 = chatDisplayData.name;
        }
      } else {
        columnIdentifier = "R";
        if (QueueHandler.rightScreen.M1 == undefined) {
          row = 0;
          column = 0;
          QueueHandler.rightScreen.M1 = chatDisplayData.name;
        } else if (QueueHandler.rightScreen.M2 == undefined) {
          row = 0;
          column = 1;
          QueueHandler.rightScreen.M2 = chatDisplayData.name;
        } else if (QueueHandler.rightScreen.T1 == undefined) {
          row = 1;
          column = 0;
          QueueHandler.rightScreen.T1 = chatDisplayData.name;
        } else if (QueueHandler.rightScreen.T2 == undefined) {
          row = 1;
          column = 1;
          QueueHandler.rightScreen.T2 = chatDisplayData.name;
        }
      }
    } else {
      if (QueueHandler.leftScreen.M1 == undefined) {
        columnIdentifier = "L";
        row = 0;
        column = 0;
        QueueHandler.leftScreen.M1 = chatDisplayData.name;
      } else if (QueueHandler.leftScreen.M2 == undefined) {
        columnIdentifier = "L";
        row = 0;
        column = 1;
        QueueHandler.leftScreen.M2 = chatDisplayData.name;
      } else if (QueueHandler.rightScreen.M1 == undefined) {
        columnIdentifier = "R";
        row = 0;
        column = 0;
        QueueHandler.rightScreen.M1 = chatDisplayData.name;
      } else if (QueueHandler.rightScreen.M2 == undefined) {
        columnIdentifier = "R";
        row = 0;
        column = 1;
        QueueHandler.rightScreen.M2 = chatDisplayData.name;
      } else if (QueueHandler.leftScreen.T1 == undefined) {
        columnIdentifier = "L";
        row = 1;
        column = 0;
        QueueHandler.leftScreen.T1 = chatDisplayData.name;
      } else if (QueueHandler.leftScreen.T2 == undefined) {
        columnIdentifier = "L";
        row = 1;
        column = 1;
        QueueHandler.leftScreen.T1 = chatDisplayData.name;
      } else if (QueueHandler.rightScreen.T1 == undefined) {
        columnIdentifier = "R";
        row = 1;
        column = 0;
        QueueHandler.rightScreen.T2 = chatDisplayData.name;
      } else if (QueueHandler.rightScreen.T2 == undefined) {
        columnIdentifier = "R";
        row = 1;
        column = 1;
        QueueHandler.rightScreen.T2 = chatDisplayData.name;
      }
    }

    Logger.log(columnIdentifier);
    Logger.log(column);
    let gridClass = `vino-${row}-${columnIdentifier}${column}`;

    Logger.log("Appending " + chatDisplayData.name + " " + gridClass);

    let html = `<div id="V${chatDisplayData.id}" class="vino-chat-frame ${gridClass}" style="display:none;">`;
    html += `<img src="${chatDisplayData.img}" class="vino-chat-actor-portrait" />`;
    html += `<div class="vino-chat-flexy-boi">`;
    html += `  <div class="vino-chat-body">`;
    html += `    <div class="vino-chat-actor-name">${chatDisplayData.name}</div>`;
    html += `    <div class="vino-chat-emotion-flare">${chatDisplayData.mood}</div>`;
    html += `    <div id="V${chatDisplayData.id}-vino-chat-text-body" class="vino-chat-text-body">`;
    html += `      <p id="V${chatDisplayData.id}-vino-chat-text-paragraph" style="font: ${chatDisplayData.font}"></p>`;
    html += `    </div>`;
    html += `  </div>`;
    html += `</div>`;
    html += `</div>`;

    $("#vino-chat-lane").append(html);

    if (previousLength == 0) {
      Logger.log("Showing vino overlay");
      $("#vino-overlay").fadeIn(500);
    }
    $("#V" + chatDisplayData.id + ".vino-chat-frame").fadeIn(500);

    Logger.log("Appended " + chatDisplayData.name);

    chatDisplayData.text = LayoutDrawer._removeExtraneousHtml(chatDisplayData.text);

    if (chatDisplayData.isEmoting) {
      chatDisplayData.text = `<i>${chatDisplayData.text}</i>`;
    } else if (chatDisplayData.skipAutoQuote) {
      Logger.log("Skipping autoquote");
    } else if (Settings.get("autoQuote")) {
      chatDisplayData.text = `${await Settings.get("quoteOpening")}${chatDisplayData.text}${await Settings.get(
        "quoteClosing"
      )}`;
    }

    gsap.to(
      `#V${chatDisplayData.id}-vino-chat-text-paragraph`,
      LayoutDrawer._wordCount(chatDisplayData.text) * LayoutDrawer.animatedSecondsPerWord,
      { text: { value: `${chatDisplayData.text}`, delimiter: "" }, ease: "none" }
    );

    var scrollFn = setInterval(function () {
      gsap.to(`#V${chatDisplayData.id}-vino-chat-text-body`, LayoutDrawer.timeBetweenScrolling / 1000, {
        scrollTo: "max",
      });
    }, LayoutDrawer.timeBetweenScrolling * 1000);

    var timeout = LayoutDrawer._wordCount(chatDisplayData.text) * (1000 * LayoutDrawer.secondsPerWord);
    if (timeout < LayoutDrawer.minimumTimeOnscreen * 1000) {
      timeout = LayoutDrawer.minimumTimeOnscreen * 1000;
    }

    if (!LayoutDrawer.DEBUGGING_LAYOUT) {
      setTimeout(function () {
        clearInterval(scrollFn);
        let frame = $("#V" + chatDisplayData.id + ".vino-chat-frame");
        frame.fadeOut(1000, function () {
          frame.remove();
          QueueHandler.removeOnscreen(chatDisplayData.name);
          QueueHandler.progress();
        });
      }, timeout);
    }
  }

  static _removeExtraneousHtml(messageText) {
    messageText = ChatHandler._caseInsensitiveReplace(messageText, "<p>", "");
    messageText = ChatHandler._caseInsensitiveReplace(messageText, "</p>", "");
    messageText = ChatHandler._caseInsensitiveReplace(messageText, "<div>", "");
    messageText = ChatHandler._caseInsensitiveReplace(messageText, "</div>", "");

    return messageText.trim();
  }

  static _wordCount(str) {
    return str.split(" ").length;
  }
}
