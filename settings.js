import { SettingsForm } from './scripts/settingsForm.js';

export const modName = 'ViNo';
const mod = 'vino';

/**
 * Provides functionality for interaction with module settings
 */
export class Settings {

    static get(setting) {
        return game.settings.get(mod, setting);
    }

    static set(setting, value) {
        game.settings.set(mod, setting, value);
    }

    static getDefaultMood(index) {
        return game.settings.get(mod, 'defaultMood' + index);
    }

    static getDefaultMoods() {
        var defaultMoods = [];
        for (var x = 1; x <= Settings.getMaxDefaultMoods(); x++) {
            defaultMoods.push(Settings.getDefaultMood(x));
        }
        return defaultMoods;
    }

    static setDefaultMood(index, val) {
        if (val == undefined) return;
        game.settings.set(mod, 'defaultMood' + index, val).then(function() {
            var sheet = window.document.styleSheets[0];

            for (var x = 1; x <= Settings.getMaxDefaultMoods(); x++) {
             var DefaultMood = Settings.getDefaultMood(x);
             if (DefaultMood == "<DELETED>") continue;
             if (DefaultMood != "") {
               console.log("ViNo | Inserting DefaultMood " + DefaultMood);
              }
            }
            
            ui.players.render();
        });
    }

    static getMaxDefaultMoods() {
        return game.settings.get(mod, 'numberOfDefaultMoods');
    }

    static setMaxDefaultMoods(val) {
        game.settings.set(mod, 'numberOfDefaultMoods', val);
    }

    static addMaxDefaultMood() {
        var newMax = this.getMaxDefaultMoods() + 1;
        game.settings.register(mod, 'defaultMood' + newMax, {
            scope: 'world',
            config: false,
            type: String,
            default: ""
        });
        game.settings.set(mod, 'numberOfDefaultMoods', newMax);
    }

    static removeMaxDefaultMood() {
        var maxDefaultMoods = this.getMaxDefaultMoods();
        if (maxDefaultMoods == 0) {
            console.log("ViNo | Cannot have less than 0 DefaultMoods");
            return;
        }
        game.settings.set(mod, 'numberOfDefaultMoods', maxDefaultMoods - 1);
    }

    static getDefaultMoodDefaultValue(index) {
        if (index == 1) return "mad";
        if (index == 2) return "sad";
        if (index == 3) return "joy";
        if (index == 4) return "fear";
        return "";
    }

    /**
     * Registers all of the necessary game settings for the module
     */
    static registerSettings() {

        game.settings.register(mod, "debugMode", {
            name: game.i18n.localize("VINO.SETTINGS.ShowDebugLogsName"),
            hint: game.i18n.localize("VINO.SETTINGS.ShowDebugLogsHint"),
            scope: 'client',
            config: true,
            type: Boolean,
            default: false
        });

        game.settings.register(mod, "numberOfDefaultMoods", {
            scope: 'world',
            config: false,
            type: Number,
            default: 4
        })

        game.settings.registerMenu(mod, 'settingsMenu', {
            name: 'Default Moods',
            label: 'Default Moods',
            icon: 'fas fa-address-book',
            type: SettingsForm,
            restricted: true
        });

        for (var x = 1; x <= Settings.getMaxDefaultMoods(); x++) {
            game.settings.register(mod, 'defaultMood' + x, {
                scope: 'world',
                config: false,
                type: String,
                default: this.getDefaultMoodDefaultValue(x)
            });
        }

        game.settings.register(mod, "defaultFont", {
            name: game.i18n.localize("VINO.SETTINGS.DefaultFontName"),
            hint: game.i18n.localize("VINO.SETTINGS.DefaultFontHint"),
            scope: 'client',
            config: true,
            type: String,
            default: "Signika, sans-serif;"
        });

        game.settings.register(mod, "animatedSecondsPerWord", {
            name: game.i18n.localize("VINO.SETTINGS.SecondsToRenderName"),
            hint: game.i18n.localize("VINO.SETTINGS.SecondsToRenderHint"),
            scope: 'client',
            config: true,
            type: Number,
            default: 0.3
        });

        game.settings.register(mod, "secondsPerWord", {
            name: game.i18n.localize("VINO.SETTINGS.SecondsOnscreenPerWordName"),
            hint: game.i18n.localize("VINO.SETTINGS.SecondsOnscreenPerWordHint"),
            scope: 'client',
            config: true,
            type: Number,
            default: 0.5
        });

        game.settings.register(mod, "minimumTimeOnScreen", {
            name: game.i18n.localize("VINO.SETTINGS.MinimumTimeOnscreenName"),
            hint: game.i18n.localize("VINO.SETTINGS.MinimumTimeOnscreenHint"),
            scope: 'client',
            config: true,
            type: Number,
            default: 5
        });

        game.settings.register(mod, "timeBetweenScrolling", {
            name: game.i18n.localize("VINO.SETTINGS.SecondsBetweenScrollName"),
            hint: game.i18n.localize("VINO.SETTINGS.SecondsBetweenScrollHint"),
            scope: 'client',
            config: true,
            type: Number,
            default: 0.5
        });

        game.settings.register(mod, "maxOnScreen", {
            name: game.i18n.localize("VINO.SETTINGS.MaxOnscreenName"),
            hint: game.i18n.localize("VINO.SETTINGS.MaxOnscreenHint"),
            scope: 'client',
            config: true,
            type: Number,
            default: 4
        });

        game.settings.register(mod, "autoQuote", {
            name: game.i18n.localize("VINO.SETTINGS.AutoQuoteName"),
            hint: game.i18n.localize("VINO.SETTINGS.AutoQuoteHint"),
            scope: 'client',
            config: true,
            type: Boolean,
            default: true
        });

        game.settings.register(mod, "quoteOpening", {
            name: game.i18n.localize("VINO.SETTINGS.QuoteOpeningName"),
            hint: game.i18n.localize("VINO.SETTINGS.QuoteOpeningHint"),
            scope: 'client',
            config: true,
            type: String,
            default: game.i18n.localize("VINO.SETTINGS.QuoteOpeningDefault")
        });

        game.settings.register(mod, "quoteClosing", {
            name: game.i18n.localize("VINO.SETTINGS.QuoteClosingName"),
            hint: game.i18n.localize("VINO.SETTINGS.QuoteClosingHint"),
            scope: 'client',
            config: true,
            type: String,
            default: game.i18n.localize("VINO.SETTINGS.QuoteClosingDefault")
        });
        

        // game.settings.registerMenu(mod, 'settingsMenu', {
        //     name: 'Custom CSS DefaultMoods',
        //     label: 'Custom CSS DefaultMoods',
        //     icon: 'fas fa-wrench',
        //     type: SettingsForm,
        //     restricted: true
        // });
    }
}