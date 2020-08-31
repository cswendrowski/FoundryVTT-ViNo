export class VisualNovelLayer extends CanvasLayer {

    static get name() {
        return "VisualNovelLayer"
      }

	constructor() {
		super();

		this.DEFAULTS = {
            visible: false,
          };
	}

	/* -------------------------------------------- */

	/** @override */
	tearDown() {

		return super.tearDown();
	}


	/* -------------------------------------------- */

	/** @override */
	async draw() {
		
    }

      /**
   * Toggles visibility of primary layer
   */
  toggle() {
    const v = this.getSetting('visible');
    this.visible = !v;
    this.setSetting('visible', !v);
  }

   /**
   * Gets and sets various layer wide properties
   * Some properties have different values depending on if user is a GM or player
   */

  getSetting(name) {
    let setting = canvas.scene.getFlag("visual-novel-chat", name);
    if (setting === undefined) setting = this.getUserSetting(name);
    if (setting === undefined) setting = this.DEFAULTS[name];
    return setting;
  }

  async setSetting(name, value) {
    const v = await canvas.scene.setFlag("visual-novel-chat", name, value);
    return v;
  }

  getUserSetting(name) {
    let setting = game.user.getFlag("visual-novel-chat", name);
    if (setting === undefined) setting = this.DEFAULTS[name];
    return setting;
  }

  async setUserSetting(name, value) {
    const v = await game.user.setFlag("visual-novel-chat", name, value);
    return v;
  }
}
