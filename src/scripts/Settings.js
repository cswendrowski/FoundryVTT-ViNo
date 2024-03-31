// import SettingsForm from "./SettingsForm.js";
import CONSTANTS from "./Constants.js";
import Logger from "./lib/Logger.js";
import TheatreHelpers from "./lib/theatre-helpers.js";

/**
 * Provides functionality for interaction with module settings
 */
export default class Settings {
    static async get(setting) {
        return await game.settings.get(CONSTANTS.MODULE_ID, setting);
    }

    static getSync(setting) {
        return game.settings.get(CONSTANTS.MODULE_ID, setting);
    }

    static async set(setting, value) {
        await game.settings.set(CONSTANTS.MODULE_ID, setting, value);
    }

    /*
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
        let storedMoods = game.settings.get(CONSTANTS.MODULE_ID, "defaultMoods");
        for (var x = 0; x < storedMoods.length; x++) {
            let mood = storedMoods[x];
            Logger.log(mood);
            if (mood != "") {
                defaultMoods.push(mood);
            }
        }
        return defaultMoods;
    }
    */

    /*
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
            if (actor.flags[CONSTANTS.MODULE_ID]) {
                actor.flags[CONSTANTS.MODULE_ID].refreshNeeded = true;
            } else {
                actor.flags[CONSTANTS.MODULE_ID] = { refreshNeeded: true };
            }
        }
    }
    */

    /**
     * Registers all of the necessary game settings for the module
     */
    static async registerSettings() {
        game.settings.register(CONSTANTS.MODULE_ID, "debug", {
            name: game.i18n.localize("vino.settings.ShowDebugLogsName"),
            hint: game.i18n.localize("vino.settings.ShowDebugLogsHint"),
            scope: "client",
            config: true,
            type: Boolean,
            default: false,
        });
        /* REMOVE IN FAVOR OF THE ONE ON THE ACTOR
        game.settings.registerMenu(CONSTANTS.MODULE_ID, "settingsMenu", {
            name: "Default Moods",
            label: "Default Moods",
            icon: "fas fa-chalkboard-user",
            type: SettingsForm,
            restricted: true,
        });
        
        game.settings.register(CONSTANTS.MODULE_ID, "defaultMoods", {
            scope: "world",
            config: false,
            type: Object,
            default: ["mad", "sad", "joy", "fear"],
        });
        */
        game.settings.register(CONSTANTS.MODULE_ID, "restrictVinoToSameScene", {
            name: game.i18n.localize("vino.settings.RestrictVinoToSameSceneName"),
            hint: game.i18n.localize("vino.settings.RestrictVinoToSameSceneHint"),
            scope: "world",
            config: true,
            type: Boolean,
            default: false,
        });

        game.settings.register(CONSTANTS.MODULE_ID, "commandKey", {
            name: game.i18n.localize("vino.settings.CommandKeyName"),
            hint: game.i18n.localize("vino.settings.CommandKeyHint"),
            scope: "client",
            config: true,
            type: String,
            default: "/vino", // game.i18n.localize("vino.settings.CommandKeyDefault"),
        });

        game.settings.register(CONSTANTS.MODULE_ID, "defaultFont", {
            name: game.i18n.localize("vino.settings.DefaultFontName"),
            hint: game.i18n.localize("vino.settings.DefaultFontHint"),
            scope: "client",
            config: true,
            type: String,
            default: "Signika, sans-serif;",
        });

        game.settings.register(CONSTANTS.MODULE_ID, "animatedSecondsPerWord", {
            name: game.i18n.localize("vino.settings.SecondsToRenderName"),
            hint: game.i18n.localize("vino.settings.SecondsToRenderHint"),
            scope: "client",
            config: true,
            type: Number,
            default: 0.3,
        });

        game.settings.register(CONSTANTS.MODULE_ID, "secondsPerWord", {
            name: game.i18n.localize("vino.settings.SecondsOnscreenPerWordName"),
            hint: game.i18n.localize("vino.settings.SecondsOnscreenPerWordHint"),
            scope: "client",
            config: true,
            type: Number,
            default: 0.5,
        });

        game.settings.register(CONSTANTS.MODULE_ID, "minimumTimeOnScreen", {
            name: game.i18n.localize("vino.settings.MinimumTimeOnscreenName"),
            hint: game.i18n.localize("vino.settings.MinimumTimeOnscreenHint"),
            scope: "client",
            config: true,
            type: Number,
            default: 5,
        });

        game.settings.register(CONSTANTS.MODULE_ID, "timeBetweenScrolling", {
            name: game.i18n.localize("vino.settings.SecondsBetweenScrollName"),
            hint: game.i18n.localize("vino.settings.SecondsBetweenScrollHint"),
            scope: "client",
            config: true,
            type: Number,
            default: 0.5,
        });

        // game.settings.register(constants.moduleName, "maxOnScreen", {
        //     name: game.i18n.localize("vino.settings.MaxOnscreenName"),
        //     hint: game.i18n.localize("vino.settings.MaxOnscreenHint"),
        //     scope: 'client',
        //     config: true,
        //     type: Number,
        //     default: 4
        // });

        game.settings.register(CONSTANTS.MODULE_ID, "autoQuote", {
            name: game.i18n.localize("vino.settings.AutoQuoteName"),
            hint: game.i18n.localize("vino.settings.AutoQuoteHint"),
            scope: "client",
            config: true,
            type: Boolean,
            default: true,
        });

        game.settings.register(CONSTANTS.MODULE_ID, "quoteOpening", {
            name: game.i18n.localize("vino.settings.QuoteOpeningName"),
            hint: game.i18n.localize("vino.settings.QuoteOpeningHint"),
            scope: "client",
            config: true,
            type: String,
            default: game.i18n.localize("vino.settings.QuoteOpeningDefault"),
        });

        game.settings.register(CONSTANTS.MODULE_ID, "quoteClosing", {
            name: game.i18n.localize("vino.settings.QuoteClosingName"),
            hint: game.i18n.localize("vino.settings.QuoteClosingHint"),
            scope: "client",
            config: true,
            type: String,
            default: game.i18n.localize("vino.settings.QuoteClosingDefault"),
        });
    }
}
