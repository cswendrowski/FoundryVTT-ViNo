import SettingsForm from "./SettingsForm.js";
import CONSTANTS from "./Constants.js";
import Logger from "./Logger.js";

/**
 * Provides functionality for interaction with module settings
 */
export default class Settings {
  static async get(setting) {
    return await game.settings.get(CONSTANTS.moduleName, setting);
  }

  static getSync(setting) {
    return game.settings.get(CONSTANTS.moduleName, setting);
  }

  static async set(setting, value) {
    await game.settings.set(CONSTANTS.moduleName, setting, value);
  }

  static async getDisplayableDefaultMoods() {
    var defaultMoods = [];
    let storedMoods = await this.get("defaultMoods");
    for (var x = 0; x < storedMoods.length; x++) {
      let mood = storedMoods[x];
      Logger.log(mood);
      if (mood != "") {
        defaultMoods.push(mood);
      }
    }
    return defaultMoods;
  }

  static synchronousGetDisplayableDefaultMoods() {
    var defaultMoods = [];
    let storedMoods = game.settings.get(CONSTANTS.moduleName, "defaultMoods");
    for (var x = 0; x < storedMoods.length; x++) {
      let mood = storedMoods[x];
      Logger.log(mood);
      if (mood != "") {
        defaultMoods.push(mood);
      }
    }
    return defaultMoods;
  }

  static async getAllDefaultMoods() {
    let moods = await this.get("defaultMoods");
    return moods;
  }

  static async addDefaultMood(val) {
    if (val == undefined) return;
    let storedMoods = await this.get("defaultMoods");
    storedMoods.push(val);
    Logger.log("Adding defaultMood" + val);
    await this.set("defaultMoods", storedMoods);
    this._scheduleRefresh();
  }

  static async removeDefaultMood(value) {
    let storedMoods = await this.get("defaultMoods");
    let adjustedMoods = storedMoods.filter((x) => x != value);
    Logger.log("Removed moods " + value);
    await this.set("defaultMoods", adjustedMoods);
    this._scheduleRefresh();
  }

  static _scheduleRefresh() {
    Logger.log("Refresh scheduled");
    for (let actor of game.actors.values()) {
      if (actor.flags.vino) {
        actor.flags.vino.refreshNeeded = true;
      } else {
        actor.flags.vino = { refreshNeeded: true };
      }
    }
  }

  /**
   * Registers all of the necessary game settings for the module
   */
  static async registerSettings() {
    game.settings.register(CONSTANTS.moduleName, "debug", {
      name: game.i18n.localize("VINO.SETTINGS.ShowDebugLogsName"),
      hint: game.i18n.localize("VINO.SETTINGS.ShowDebugLogsHint"),
      scope: "client",
      config: true,
      type: Boolean,
      default: false,
    });

    game.settings.registerMenu(CONSTANTS.moduleName, "settingsMenu", {
      name: "Default Moods",
      label: "Default Moods",
      icon: "fas fa-address-book",
      type: SettingsForm,
      restricted: true,
    });

    game.settings.register(CONSTANTS.moduleName, "defaultMoods", {
      scope: "world",
      config: false,
      type: Object,
      default: ["mad", "sad", "joy", "fear"],
    });

    game.settings.register(CONSTANTS.moduleName, "restrictVinoToSameScene", {
      name: game.i18n.localize("VINO.SETTINGS.RestrictVinoToSameSceneName"),
      hint: game.i18n.localize("VINO.SETTINGS.RestrictVinoToSameSceneHint"),
      scope: "world",
      config: true,
      type: Boolean,
      default: false,
    });

    game.settings.register(CONSTANTS.moduleName, "commandKey", {
      name: game.i18n.localize("VINO.SETTINGS.CommandKeyName"),
      hint: game.i18n.localize("VINO.SETTINGS.CommandKeyHint"),
      scope: "client",
      config: true,
      type: String,
      default: game.i18n.localize("VINO.SETTINGS.CommandKeyDefault"),
    });

    game.settings.register(CONSTANTS.moduleName, "defaultFont", {
      name: game.i18n.localize("VINO.SETTINGS.DefaultFontName"),
      hint: game.i18n.localize("VINO.SETTINGS.DefaultFontHint"),
      scope: "client",
      config: true,
      type: String,
      default: "Signika, sans-serif;",
    });

    game.settings.register(CONSTANTS.moduleName, "animatedSecondsPerWord", {
      name: game.i18n.localize("VINO.SETTINGS.SecondsToRenderName"),
      hint: game.i18n.localize("VINO.SETTINGS.SecondsToRenderHint"),
      scope: "client",
      config: true,
      type: Number,
      default: 0.3,
    });

    game.settings.register(CONSTANTS.moduleName, "secondsPerWord", {
      name: game.i18n.localize("VINO.SETTINGS.SecondsOnscreenPerWordName"),
      hint: game.i18n.localize("VINO.SETTINGS.SecondsOnscreenPerWordHint"),
      scope: "client",
      config: true,
      type: Number,
      default: 0.5,
    });

    game.settings.register(CONSTANTS.moduleName, "minimumTimeOnScreen", {
      name: game.i18n.localize("VINO.SETTINGS.MinimumTimeOnscreenName"),
      hint: game.i18n.localize("VINO.SETTINGS.MinimumTimeOnscreenHint"),
      scope: "client",
      config: true,
      type: Number,
      default: 5,
    });

    game.settings.register(CONSTANTS.moduleName, "timeBetweenScrolling", {
      name: game.i18n.localize("VINO.SETTINGS.SecondsBetweenScrollName"),
      hint: game.i18n.localize("VINO.SETTINGS.SecondsBetweenScrollHint"),
      scope: "client",
      config: true,
      type: Number,
      default: 0.5,
    });

    // game.settings.register(constants.moduleName, "maxOnScreen", {
    //     name: game.i18n.localize("VINO.SETTINGS.MaxOnscreenName"),
    //     hint: game.i18n.localize("VINO.SETTINGS.MaxOnscreenHint"),
    //     scope: 'client',
    //     config: true,
    //     type: Number,
    //     default: 4
    // });

    game.settings.register(CONSTANTS.moduleName, "autoQuote", {
      name: game.i18n.localize("VINO.SETTINGS.AutoQuoteName"),
      hint: game.i18n.localize("VINO.SETTINGS.AutoQuoteHint"),
      scope: "client",
      config: true,
      type: Boolean,
      default: true,
    });

    game.settings.register(CONSTANTS.moduleName, "quoteOpening", {
      name: game.i18n.localize("VINO.SETTINGS.QuoteOpeningName"),
      hint: game.i18n.localize("VINO.SETTINGS.QuoteOpeningHint"),
      scope: "client",
      config: true,
      type: String,
      default: game.i18n.localize("VINO.SETTINGS.QuoteOpeningDefault"),
    });

    game.settings.register(CONSTANTS.moduleName, "quoteClosing", {
      name: game.i18n.localize("VINO.SETTINGS.QuoteClosingName"),
      hint: game.i18n.localize("VINO.SETTINGS.QuoteClosingHint"),
      scope: "client",
      config: true,
      type: String,
      default: game.i18n.localize("VINO.SETTINGS.QuoteClosingDefault"),
    });
  }
}
