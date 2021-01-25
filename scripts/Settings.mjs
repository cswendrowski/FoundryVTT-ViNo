import SettingsForm from './SettingsForm.mjs';
import constants from './Constants.mjs';
import Logger from './Logger.mjs';

/**
 * Provides functionality for interaction with module settings
 */
export default class Settings {

    static async get(setting) {
        return await game.settings.get(constants.moduleName, setting);
    }

    static getSync(setting) {
        return game.settings.get(constants.moduleName, setting);
    }

    static async set(setting, value) {
        await game.settings.set(constants.moduleName, setting, value);
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
        let storedMoods = game.settings.get(constants.moduleName, "defaultMoods");
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
        await this.set('defaultMoods', storedMoods);
        this._scheduleRefresh();       
    }

    static async removeDefaultMood(value) {
        let storedMoods = await this.get("defaultMoods");
        let adjustedMoods = storedMoods.filter(x => x != value);
        Logger.log("Removed moods " + value);
        await this.set('defaultMoods', adjustedMoods);
        this._scheduleRefresh();    
    }

    static _scheduleRefresh() { 
        Logger.log("Refresh scheduled");
        game.actors.entities.forEach(actor => {
            if (actor.data.flags.vino) {
                actor.data.flags.vino.refreshNeeded = true;
            }
            else {
                actor.data.flags.vino = { refreshNeeded: true }
            }
        })
    }

    /**
     * Registers all of the necessary game settings for the module
     */
    static async registerSettings() {

        game.settings.register(constants.moduleName, "debugMode", {
            name: game.i18n.localize("VINO.SETTINGS.ShowDebugLogsName"),
            hint: game.i18n.localize("VINO.SETTINGS.ShowDebugLogsHint"),
            scope: 'client',
            config: true,
            type: Boolean,
            default: false
        });

        game.settings.registerMenu(constants.moduleName, 'settingsMenu', {
            name: 'Default Moods',
            label: 'Default Moods',
            icon: 'fas fa-address-book',
            type: SettingsForm,
            restricted: true
        });

        game.settings.register(constants.moduleName, "defaultMoods", {
            scope: 'world',
            config: false,
            type: Object,
            default: [ "mad", "sad", "joy", "fear" ]
        })

        game.settings.register(constants.moduleName, "commandKey", {
            name: game.i18n.localize("VINO.SETTINGS.CommandKeyName"),
            hint: game.i18n.localize("VINO.SETTINGS.CommandKeyHint"),
            scope: 'client',
            config: true,
            type: String,
            default: game.i18n.localize("VINO.SETTINGS.CommandKeyDefault")
        });

        game.settings.register(constants.moduleName, "defaultFont", {
            name: game.i18n.localize("VINO.SETTINGS.DefaultFontName"),
            hint: game.i18n.localize("VINO.SETTINGS.DefaultFontHint"),
            scope: 'client',
            config: true,
            type: String,
            default: "Signika, sans-serif;"
        });

        game.settings.register(constants.moduleName, "animatedSecondsPerWord", {
            name: game.i18n.localize("VINO.SETTINGS.SecondsToRenderName"),
            hint: game.i18n.localize("VINO.SETTINGS.SecondsToRenderHint"),
            scope: 'client',
            config: true,
            type: Number,
            default: 0.3
        });

        game.settings.register(constants.moduleName, "secondsPerWord", {
            name: game.i18n.localize("VINO.SETTINGS.SecondsOnscreenPerWordName"),
            hint: game.i18n.localize("VINO.SETTINGS.SecondsOnscreenPerWordHint"),
            scope: 'client',
            config: true,
            type: Number,
            default: 0.5
        });

        game.settings.register(constants.moduleName, "minimumTimeOnScreen", {
            name: game.i18n.localize("VINO.SETTINGS.MinimumTimeOnscreenName"),
            hint: game.i18n.localize("VINO.SETTINGS.MinimumTimeOnscreenHint"),
            scope: 'client',
            config: true,
            type: Number,
            default: 5
        });

        game.settings.register(constants.moduleName, "timeBetweenScrolling", {
            name: game.i18n.localize("VINO.SETTINGS.SecondsBetweenScrollName"),
            hint: game.i18n.localize("VINO.SETTINGS.SecondsBetweenScrollHint"),
            scope: 'client',
            config: true,
            type: Number,
            default: 0.5
        });

        // game.settings.register(constants.moduleName, "maxOnScreen", {
        //     name: game.i18n.localize("VINO.SETTINGS.MaxOnscreenName"),
        //     hint: game.i18n.localize("VINO.SETTINGS.MaxOnscreenHint"),
        //     scope: 'client',
        //     config: true,
        //     type: Number,
        //     default: 4
        // });

        game.settings.register(constants.moduleName, "autoQuote", {
            name: game.i18n.localize("VINO.SETTINGS.AutoQuoteName"),
            hint: game.i18n.localize("VINO.SETTINGS.AutoQuoteHint"),
            scope: 'client',
            config: true,
            type: Boolean,
            default: true
        });

        game.settings.register(constants.moduleName, "quoteOpening", {
            name: game.i18n.localize("VINO.SETTINGS.QuoteOpeningName"),
            hint: game.i18n.localize("VINO.SETTINGS.QuoteOpeningHint"),
            scope: 'client',
            config: true,
            type: String,
            default: game.i18n.localize("VINO.SETTINGS.QuoteOpeningDefault")
        });

        game.settings.register(constants.moduleName, "quoteClosing", {
            name: game.i18n.localize("VINO.SETTINGS.QuoteClosingName"),
            hint: game.i18n.localize("VINO.SETTINGS.QuoteClosingHint"),
            scope: 'client',
            config: true,
            type: String,
            default: game.i18n.localize("VINO.SETTINGS.QuoteClosingDefault")
        });
        
    }
}