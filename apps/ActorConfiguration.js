import constants from '../constants.js';

export default class ActorConfiguration extends FormApplication {
  /* const app = ;
    static app; */

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: 'vino-actor-configuration',
      template: `${constants.modulePath}/templates/actor-vino-configuration.html`,
      popOut: true,
      width: 600,
      height: 1000,
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
        altdefault: "",
        madimg: "",
        sadimg: "",
        joyimg: "",
        fearimg: ""
      };
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
