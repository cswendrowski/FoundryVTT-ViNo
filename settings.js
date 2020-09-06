export const modName = 'Vino';
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
            default: 1.0
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

        // game.settings.registerMenu(mod, 'settingsMenu', {
        //     name: 'Custom CSS Rules',
        //     label: 'Custom CSS Rules',
        //     icon: 'fas fa-wrench',
        //     type: SettingsForm,
        //     restricted: true
        // });
    }
}