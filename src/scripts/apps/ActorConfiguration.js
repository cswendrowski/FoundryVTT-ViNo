import CONSTANTS from "../Constants.js";
import Settings from "../Settings.js";
import Logger from "../lib/Logger.js";
import TheatreHelpers from "../lib/theatre-helpers.js";

export default class ActorConfiguration extends FormApplication {
    /* const app = ;
    static app; */

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "vino-actor-configuration",
            template: `${CONSTANTS.modulePath}/templates/actor-vino-configuration.html`,
            popOut: true,
            width: 800, // 1000,
            height: 700,
            closeOnSubmit: false,
            submitOnClose: true,
        });
    }

    constructor(actor) {
        super();
        this.actor = actor;
        this.shouldClose = false;
    }

    async getData() {
        let flags = this.actor.flags;

        if (!flags[CONSTANTS.MODULE_ID]) {
            setProperty(flags, CONSTANTS.MODULE_ID, {
                enabled: true,
                font: "",
                // images: [],
                altdefault: "",
                // refreshNeeded: true,
                preferredSide: "",
                emotes: {},
            });
        }
        /*
        if (flags[CONSTANTS.MODULE_ID].images == undefined) {
            flags[CONSTANTS.MODULE_ID].images = [];
        }
        */

        if (flags[CONSTANTS.MODULE_ID].enabled == undefined) {
            flags[CONSTANTS.MODULE_ID].enabled = true;
        }
        // let actorId = this.actor.id;
        let emotes = {};
        let fonts = [];

        emotes = TheatreHelpers.getSimpleEmotes(this.actor);
        fonts = TheatreHelpers.getFonts();
        /*
        if (flags[CONSTANTS.MODULE_ID].refreshNeeded) {
            Logger.log("Refreshing ViNo images");
            let moods = await Settings.getDisplayableDefaultMoods();
            let existingMoodImages = Object.values(flags[CONSTANTS.MODULE_ID].images).filter((x) => x.name != null && x.path != null);
            Logger.log("Configured moods:");
            Logger.logObject(moods);
            Logger.log("Existing moods:");
            Logger.logObject(existingMoodImages);

            // Update existing moods
            for (let x = 0; x < moods.length; x++) {
                let defaultMood = moods[x];

                if (defaultMood != "") {
                    let existingMood = existingMoodImages.find((x) => x.name == defaultMood);

                    Logger.log("Found matching existing mood:");
                    Logger.logObject(existingMood);

                    if (existingMood == undefined || existingMood.path == "") {
                        let moodInfo = {
                            name: defaultMood,
                            path: "",
                        };

                        // Migration from old paths
                        if (defaultMood == game.i18n.localize("vino.actorconfig.DefaultMoods.Mad")) {
                            moodInfo.path = flags[CONSTANTS.MODULE_ID].madimg;
                        } else if (defaultMood == game.i18n.localize("vino.actorconfig.DefaultMoods.Sad")) {
                            moodInfo.path = flags[CONSTANTS.MODULE_ID].sadimg;
                        } else if (defaultMood == game.i18n.localize("vino.actorconfig.DefaultMoods.Joy")) {
                            moodInfo.path = flags[CONSTANTS.MODULE_ID].joyimg;
                        } else if (defaultMood == game.i18n.localize("vino.actorconfig.DefaultMoods.Fear")) {
                            moodInfo.path = flags[CONSTANTS.MODULE_ID]fearimg;
                        }

                        if (moodInfo.path == undefined) moodInfo.path = "";

                        flags[CONSTANTS.MODULE_ID].images[x] = moodInfo;
                        // this.actor.setFlag("vino", `images.${x}.name`, moodInfo.name);
                        // this.actor.setFlag("vino", `images.${x}.path`, moodInfo.path);
                        Logger.log("Inserted new " + moodInfo.name);
                        Logger.logObject(moodInfo);
                    }
                }
            }

            // Remove moods that don't match
            let unmatchedMoods = existingMoodImages.filter((x) => !moods.includes(x.name));
            Logger.log(unmatchedMoods);
            for (let x = 0; x < unmatchedMoods.length; x++) {
                let unmatched = unmatchedMoods[x];
                let index = existingMoodImages.indexOf(unmatched);
                await this.actor.unsetFlag("vino", `images.${index}.name`);
                await this.actor.unsetFlag("vino", `images.${index}.path`);
                Logger.log("Unset vino.images." + index);
            }
        }
        */
        return {
            actor: this.actor,
            emotes: emotes,
            fonts: fonts,
        };
    }

    async _updateObject(event, formData) {
        //formData["_id"] = this.actorId;

        Logger.logObject(formData);
        /*
        let displayableMoods = await Settings.getDisplayableDefaultMoods();
        for (var x = 0; x < displayableMoods.length; x++) {
            if (formData["flags[CONSTANTS.MODULE_ID].emotes." + x + ".image"] != undefined) {
                formData["flags[CONSTANTS.MODULE_ID].emotes." + x + ".name"] = displayableMoods[x].toLowerCase();
            }
        }
        */
        await this.actor.update(formData);
        if (this.shouldClose) {
            await this.close();
        }
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find("img[data-edit]").click((ev) => this._onEditImage(ev));
        html.find(".vino-configure-submit").click((event) => {
            this.shouldClose = true;
        });

        // html.find(".vino-actor-configuration-row-item.emote > select").on("change", async (event) => {
        //     let valueFlag = event.currentTarget.selectedOptions[0].value;
        //     let keyMood = event.currentTarget.dataset.key;
        //     // let keyFlag = event.currentTarget.name;
        //     // Logger.debug(valueFlag);
        //     await this.actor.setFlag(
        //         CONSTANTS.MODULE_ID,
        //         `${CONSTANTS.FLAGS.EMOTES}.${keyMood}.${CONSTANTS.FLAGS.FONT}`,
        //         valueFlag,
        //     );
        // });
    }

    _onEditImage(event) {
        const attr = event.currentTarget.dataset.edit;
        const current = getProperty(this.actor, attr);
        new FilePicker({
            type: "image",
            current: current,
            callback: (path) => {
                event.currentTarget.src = path;
                this._onSubmit(event);
            },
            top: this.position.top + 40,
            left: this.position.left + 10,
        }).browse(current);
    }
}
