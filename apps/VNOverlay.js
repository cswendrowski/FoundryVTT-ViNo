import constants from '../constants.js';

export default class VNOverlay extends Application {
  /* const app = ;
    static app; */

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: 'vino-overlay',
      template: `${constants.modulePath}/templates/vino-frame.html`,
      popOut: false,
    });
  }

  getData(options = {}) {
    options = super.getData(options);
    return options;
  }

  static init() {
    const instance = new this();
    ui.butlerOverlay = instance;

    instance.render(true);
  }

  activateListeners(html) {
    super.activateListeners(html);
  }
}
