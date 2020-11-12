import { Settings } from '../settings.js';

export class SettingsForm extends FormApplication {

    constructor(object, options = {}) {
        super(object, options);
    }

    /**
    * Default Options for this FormApplication
    */
    static get defaultOptions() {
        var me = this;
        return mergeObject(super.defaultOptions, {
            id: "defaultmoods-settings-form",
            title: "ViNo Default Moods",
            template: "./modules/vino/templates/mood-settings.html",
            classes: ["sheet"],
            width: 500,
            closeOnSubmit: true
        });
    }

    getData() {

        var DefaultMoodsArray = [];

        for (var x = 1; x <= Settings.getMaxDefaultMoods(); x++) {
            DefaultMoodsArray.push(Settings.getDefaultMood(x));
        }

        const data = {
            moods: this.getIndexValueList(DefaultMoodsArray),
            cantRemove: Settings.getMaxDefaultMoods() == 0
        };

        console.log(data);

        return data;
    }

    /** 
     * Executes on form submission.
     * @param {Object} e - the form submission event
     * @param {Object} d - the form data
     */
    async _updateObject(e, d) {
        var buttonPressed = $(document.activeElement).val();

        console.log(buttonPressed);

        if (buttonPressed === "addMood") {
            Settings.addMaxDefaultMood();
        }
        else if (buttonPressed === "removeMood") {
            Settings.removeMaxDefaultMood();
        }

        for (var x = 1; x <= Settings.getMaxDefaultMoods(); x++) {
            var toUpdate = d["defaultmood" + x];
            console.log("ViNo | Adding Default Mood " + toUpdate);
            Settings.setDefaultMood(x, toUpdate);
        }
    }

    activateListeners(html) {
        super.activateListeners(html);
        
        $('.mood-delete').click(function() {
            var moodId = $(this).data('moodid');
            $(this).parent().remove();
            Settings.setDefaultMood(moodId, '<DELETED>');
        });

    }

    getIndexValueList(array) {
        let options = [];
        array.forEach((x, i) => {
            if (x != '<DELETED>') {
                options.push({ value: x, index: i + 1 });
            }
        });
        return options;
    }

    getSelectList(array, selected) {
        let options = [];
        array.forEach((x, i) => {
            options.push({ value: x, selected: i == selected });
        });
        return options;
    }
}
