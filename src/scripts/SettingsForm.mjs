import Settings from "./Settings.mjs";
import Logger from "./Logger.mjs";

export default class SettingsForm extends FormApplication {
  constructor(object, options = {}) {
    super(object, options);
  }

  /**
   * Default Options for this FormApplication
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "defaultmoods-settings-form",
      title: "ViNo Default Moods",
      template: "./modules/vino/templates/mood-settings.html",
      classes: ["sheet"],
      width: 500,
      closeOnSubmit: true,
    });
  }

  async getData() {
    let storedMoods = await Settings.getAllDefaultMoods();

    const data = {
      moods: this._getIndexValueList(storedMoods),
      cantRemove: storedMoods.length == 0,
    };

    Logger.log(data);

    return data;
  }

  /**
   * Executes on form submission.
   * @param {Object} e - the form submission event
   * @param {Object} d - the form data
   */
  async _updateObject(e, d) {
    var buttonPressed = $(document.activeElement).val();

    Logger.logObject(buttonPressed);

    Logger.logObject(d);
    let values = Object.values(d);
    Logger.logObject(values);
    await Settings.set("defaultMoods", values);
  }

  activateListeners(html) {
    super.activateListeners(html);

    $(".mood-add").click(function () {
      Settings.addDefaultMood("blank");
    });

    $(".mood-delete").click(function () {
      var moodId = $(this).data("moodid");
      $(this).parent().remove();
      Settings.removeDefaultMood(moodId);
    });
  }

  _getIndexValueList(array) {
    let options = [];
    array.forEach((x, i) => {
      options.push({ value: x, index: i + 1 });
    });
    return options;
  }
}
