const CONSTANTS = {
    MODULE_ID: "vino",
    modulePath: "modules/vino",
    moduleName: "vino",
    moduleLabel: "ViNo - Visual Interactive Novel Overlay",
    FLAGS: {
        SKIP: "skip",
        ALT_DEFAULT: "altdefault",
        ENABLED: "enabled",
        //
        PREFERRED_SIDE: "preferredSide",
        MOOD: "mood",
        FONT: "font",
        IMAGE: "image",
        LABEL: "label",
        NAME: "name",
        SKIP_AUTO_QUOTE: "skipAutoQuote",
        /** @deprecated */
        REFRESH_NEEDED: "refreshNeeded",
        /** @deprecated */
        IMAGES: "images", // TODO to remove or better manage
        // MOOD TYPE
        /** @deprecated */
        MAD_IMG: "madimg", // TODO to remove or better manage
        /** @deprecated */
        SAD_IMG: "sadimg", // TODO to remove or better manage
        /** @deprecated */
        JOY_IMG: "joyimg", // TODO to remove or better manage
        /** @deprecated */
        FEAR_IMG: "fearimg", // TODO to remove or better manage
        //TODO ADD OTHER FROM THEATRE LIST
        // ADDED FORM 4535992
        EMOTES: "emotes",
    },
    CHAT_DISPLAY_DATA: {
        ID: "id",
        NAME: "name",
        IMG: "img",
        TEXT: "text",
        MESSAGE: "message",
        PREFERRED_SIDE: "preferredSide",
        MOOD: "mood",
        FONT: "font",
        IS_EMOTING: "isEmoting",
        SKIP_AUTO_QUOTE: "skipAutoQuote",
    },
};
export default CONSTANTS;
