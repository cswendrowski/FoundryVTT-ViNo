import constants from "../scripts/Constants.mjs";
import Settings from "../scripts/Settings.mjs";
import Logger from "../scripts/Logger.mjs";

export default class ActorConfiguration extends FormApplication {
  /* const app = ;
    static app; */

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "vino-actor-configuration",
      template: `${constants.modulePath}/templates/actor-vino-configuration.html`,
      popOut: true,
      width: 1000,
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

    if (flags.vino == undefined) {
      flags.vino = {
        enabled: true,
        font: "",
        images: [],
        altdefault: "",
        refreshNeeded: true,
        preferredSide: "",
      };
    }

    if (flags.vino.images == undefined) {
      flags.vino.images = [];
    }

    if (flags.vino.enabled == undefined) {
      flags.vino.enabled = true;
    }

    if (flags.vino.refreshNeeded) {
      Logger.log("Refreshing ViNo images");
      let moods = await Settings.getDisplayableDefaultMoods();
      let existingMoodImages = Object.values(flags.vino.images).filter((x) => x.name != null && x.path != null);
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
            if (defaultMood == game.i18n.localize("VINO.ACTORCONFIG.DefaultMoods.Mad")) {
              moodInfo.path = flags.vino.madimg;
            } else if (defaultMood == game.i18n.localize("VINO.ACTORCONFIG.DefaultMoods.Sad")) {
              moodInfo.path = flags.vino.sadimg;
            } else if (defaultMood == game.i18n.localize("VINO.ACTORCONFIG.DefaultMoods.Joy")) {
              moodInfo.path = flags.vino.joyimg;
            } else if (defaultMood == game.i18n.localize("VINO.ACTORCONFIG.DefaultMoods.Fear")) {
              moodInfo.path = flags.vino.fearimg;
            }

            if (moodInfo.path == undefined) moodInfo.path = "";

            flags.vino.images[x] = moodInfo;
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

    return {
      actor: this.actor,
    };
  }

  async _updateObject(event, formData) {
    //formData["_id"] = this.actorId;

    Logger.logObject(formData);

    let displayableMoods = await Settings.getDisplayableDefaultMoods();
    for (var x = 0; x < displayableMoods.length; x++) {
      if (formData["flags.vino.images." + x + ".path"] != undefined) {
        formData["flags.vino.images." + x + ".name"] = displayableMoods[x].toLowerCase();
      }
    }

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
