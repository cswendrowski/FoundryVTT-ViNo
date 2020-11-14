import constants from '../constants.js';
import { Settings } from "../settings.js";

export default class ActorConfiguration extends FormApplication {
  /* const app = ;
    static app; */

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: 'vino-actor-configuration',
      template: `${constants.modulePath}/templates/actor-vino-configuration.html`,
      popOut: true,
      width: 1000,
      height: 700,
      closeOnSubmit: false
    });
  }

  constructor(actorId) {
    super();
    this.actorId = actorId;
    this.actor = game.actors.get(actorId);
    this.shouldClose = false;
  }

  getData() {
    let flags = this.actor.data.flags;

    if (flags.vino == undefined) {
      flags.vino = {
        font: "",
        images: [],
        altdefault: ""
      };
    }

    if (flags.vino.images == undefined) {
      flags.vino.images = [];
    }

    var moodsLength = Settings.getMaxDefaultMoods();
    if (Object.keys(flags.vino.images).length < moodsLength) {
      for (var x = 1; x <= moodsLength; x++) {
        var defaultMood = Settings.getDefaultMood(x).toLowerCase();
        if (defaultMood == "<DELETED>") continue;

        if (defaultMood != "" && (flags.vino.images[x] == undefined || flags.vino.images[x] == "")) {
          let moodInfo = {
            name: defaultMood,
            path: ""
          };

          if (defaultMood == game.i18n.localize("VINO.ACTORCONFIG.DefaultMoods.Mad")) {
            moodInfo.path = flags.vino.madimg;
          }
          else if (defaultMood == game.i18n.localize("VINO.ACTORCONFIG.DefaultMoods.Sad")) {
            moodInfo.path = flags.vino.sadimg;
          }
          else if (defaultMood == game.i18n.localize("VINO.ACTORCONFIG.DefaultMoods.Joy")) {
            moodInfo.path = flags.vino.joyimg;
          }
          else if (defaultMood == game.i18n.localize("VINO.ACTORCONFIG.DefaultMoods.Fear")) {
            moodInfo.path = flags.vino.fearimg;
          }

          flags.vino.images[x] = moodInfo;
        }
       }
    }

    return {
        actor: this.actor
    }
  }

  async _updateObject(event, formData) {
    formData["_id"] = this.actorId;
    let actor = game.actors.get(this.actorId);

    for (var x = 1; x <= Settings.getMaxDefaultMoods(); x++) {
      formData["flags.vino.images." + x + ".name"] = Settings.getDefaultMood(x).toLowerCase();
    }
    
    actor.update(formData);
    if (this.shouldClose) {
      this.close();
    }
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find('img[data-edit]').click(ev => this._onEditImage(ev));
    html.find(".vino-configure-submit").click(event => {
      this.shouldClose = true;
    });
  }

  _onEditImage(event) {
    const attr = event.currentTarget.dataset.edit;
    const current = getProperty(this.actor.data, attr);
    new FilePicker({
      type: "image",
      current: current,
      callback: path => {
        event.currentTarget.src = path;
        this._onSubmit(event);
      },
      top: this.position.top + 40,
      left: this.position.left + 10
    }).browse(current);
  }
}
