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

    if (flags.vino.images.length == 0) {
      for (var x = 1; x <= Settings.getMaxDefaultMoods(); x++) {
        var defaultMood = Settings.getDefaultMood(x).toLowerCase();
        if (defaultMood == "<DELETED>") continue;
        if (defaultMood != "") {
          let moodInfo = {
            name: defaultMood,
            path: ""
          };

          if (defaultMood == "mad") {
            moodInfo.path = flags.vino.madimg;
          }
          else if (defaultMood == "sad") {
            moodInfo.path = flags.vino.sadimg;
          }
          else if (defaultMood == "joy") {
            moodInfo.path = flags.vino.joyimg;
          }
          else if (defaultMood == "fear") {
            moodInfo.path = flags.vino.fearimg;
          }

          flags.vino.images.push(moodInfo);
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
