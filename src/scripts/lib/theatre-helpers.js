import CONSTANTS from "../Constants.js";
import Logger from "./Logger.js";
import { RetrieveHelpers } from "./retrieve-helpers.js";

export default class TheatreHelpers {
    /**
     * @typedef {Object} TheatreEmote
     * @property {string} name e.g. happytears
     * @property {string} fatype e.g. far
     * @property {string} faname e.g. fa-grin-tears
     * @property {string} label
     * @property {{animations:[{name:string;syntax:string}]} rigging
     *
     */

    /**
     * Get the emotes for the actor by merging whatever is in the emotes flag with the default base
     *
     * @param {string} actorId The actorId of the actor to get emotes from.
     * @param {boolean} disableDefault Wither or not default emotes are disabled. in which case, we don't merge the actor emotes with the default ones.
     * @return {Object.<string,{name:string;image:string;fatype:string;fatname:string;label:string;rigging:{animations:[{name:string;syntax:string}]}}>} An Object containg the emotes for the requested actorId.
     */
    static _getActorEmotes(actorId, disableDefault) {
        if (game.modules.get("theatre")?.active) {
            return game.modules.get("theatre").api.getActorEmotes(actorId, disableDefault);
        } else {
            return TheatreHelpers._getDefaultEmotes();
        }
    }

    /**
     * Get the emotes for the actor by merging whatever is in the emotes flag with the default base
     *
     * @param {string} actorId The actorId of the actor to get emotes from.
     * @param {boolean} disableDefault Wither or not default emotes are disabled. in which case, we don't merge the actor emotes with the default ones.
     * @return {{name:string;imageRef:string;image:string;label:string;font:string}}
     */
    static getSimpleEmotes(actorId, disableDefault) {
        const actor = RetrieveHelpers.getActorSync(actorId);
        const emotes = TheatreHelpers._getActorEmotes(actorId, disableDefault);
        const moods = [];
        const vinoMoods =
            foundry.utils.getProperty(actor, `flags.${CONSTANTS.MODULE_ID}.${CONSTANTS.FLAGS.EMOTES}`) || {};
        for (const [key, value] of Object.entries(emotes)) {
            const currentEmote = vinoMoods[key];
            moods.push({
                key: key,
                name: value.name ?? currentEmote?.name ?? "",
                imageRef: value.image ?? "modules/vino/assets/emotes/blank.png",
                image: currentEmote?.image ?? actor.img ?? "",
                label: value.label ?? currentEmote?.label ?? value.name ?? "",
                font: value.font ?? currentEmote?.font ?? "", // ?? "Signika, sans-serif;",
            });
        }
        return moods;
    }

    /**
     * Prepare fonts and return the list of fonts available
     *
     * @return {string[]} : The array of font familys to use.
     */
    static getFonts() {
        if (game.modules.get("theatre")?.active) {
            return game.modules.get("theatre").api.getFonts();
        } else {
            return [];
        }
    }

    /**
     * Get default emotes, immutable
     *
     * @return (Object) : An Object, whose properties are the default set
     *                     emotes.
     */
    static _getDefaultEmotes() {
        return {
            smile: {
                name: "smile",
                fatype: "far",
                faname: "fa-smile",
                label: game.i18n.localize("Theatre.Emote.Smile"),
                rigging: {
                    animations: [{ name: "smile", syntax: "smile|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" }],
                },
            },
            grin: {
                name: "grin",
                fatype: "far",
                faname: "fa-grin",
                label: game.i18n.localize("Theatre.Emote.Grin"),
                rigging: {
                    animations: [{ name: "grin", syntax: "grin|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" }],
                },
            },
            happy: {
                name: "happy",
                fatype: "far",
                faname: "fa-smile-beam",
                label: game.i18n.localize("Theatre.Emote.Happy"),
                rigging: {
                    animations: [
                        { name: "happy", syntax: "happy|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        { name: "line_a", syntax: "line|0.5;(ease:bounce);x:45%,40%;y:5%,0%;rotation:-20,-20" },
                        { name: "line_b", syntax: "line|0.5;(ease:bounce);x:35%,25%;y:15%,12%;rotation:-65,-65" },
                        { name: "line_c", syntax: "line|0.5;(ease:bounce);x:55%,60%;y:5%,0%;rotation:20,20" },
                        { name: "line_d", syntax: "line|0.5;(ease:bounce);x:65%,75%;y:15%,12%;rotation:65,65" },
                    ],
                },
            },
            happytears: {
                name: "happytears",
                fatype: "far",
                faname: "fa-grin-tears",
                label: game.i18n.localize("Theatre.Emote.HappyTears"),
                rigging: {
                    animations: [
                        { name: "happytears", syntax: "happytears|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "line_a",
                            syntax: "line|0.5;(ease:bounce);x:40%,35%;y:5%,0%;rotation:-20,-20|0.5;(repeat:-1,yoyo:true);scaleX:1,1.2;scaleY:1,1.5",
                        },
                        {
                            name: "line_b",
                            syntax: "line|0.5;(ease:bounce);x:30%,20%;y:15%,12%;rotation:-65,-65|0.5;(repeat:-1,yoyo:true);scaleX:1,1.2;scaleY:1,1.5",
                        },
                        {
                            name: "line_c",
                            syntax: "line|0.5;(ease:bounce);x:60%,65%;y:5%,0%;rotation:20,20|0.5;(repeat:-1,yoyo:true);scaleX:1,1.2;scaleY:1,1.5",
                        },
                        {
                            name: "line_d",
                            syntax: "line|0.5;(ease:bounce);x:70%,80%;y:15%,12%;rotation:65,65|0.5;(repeat:-1,yoyo:true);scaleX:1,1.2;scaleY:1,1.5",
                        },
                        {
                            name: "tears_a",
                            syntax: "tears|0.5;(repeat:-1,repeatDelay:1.7);x:60%,110%;y:25%,40%;rotation:-30,-30;alpha:0.5,0|0;scaleX:-1,-1",
                        },
                        {
                            name: "tears_b",
                            syntax: "tears|0.5;(repeat:-1,repeatDelay:0.8);x:40%,-10%;y:25%,40%;rotation:30,30;alpha:0.5,0",
                        },
                    ],
                },
            },
            dissatisfied: {
                name: "dissatisfied",
                fatype: "far",
                faname: "fa-frown-open",
                label: game.i18n.localize("Theatre.Emote.Dissatisfied"),
                rigging: {
                    animations: [
                        { name: "dissatisfied", syntax: "dissatisfied|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                    ],
                },
            },
            frown: {
                name: "frown",
                fatype: "far",
                faname: "fa-frown",
                label: game.i18n.localize("Theatre.Emote.Frown"),
                rigging: {
                    animations: [
                        { name: "frown", syntax: "frown|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        { name: "sinking", syntax: "sinking|0.5;(ease:power2);x:50%,50%;y:-20%,15%;alpha:0,0.5" },
                    ],
                },
            },
            sad: {
                name: "sad",
                fatype: "far",
                faname: "fa-sad-tear",
                label: game.i18n.localize("Theatre.Emote.Sad"),
                rigging: {
                    animations: [
                        { name: "sad", syntax: "sad|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "swirl_a",
                            syntax: "swirl|0.5;(ease:power4);x:110%,75%;y:0%,10%;alpha:0,1|1;(repeat:-1);rotation:0,360",
                        },
                        {
                            name: "swirl_b",
                            syntax: "swirl|0.5;(ease:power4);x:110%,65%;y:0%,40%;alpha:0,1|1;(repeat:-1);rotation:0,360",
                        },
                        {
                            name: "swirl_c",
                            syntax: "swirl|0.5;(ease:power4);x:110%,90%;y:110%,50%;alpha:0,1|1;(repeat:-1);rotation:0,360",
                        },
                        {
                            name: "swirl_d",
                            syntax: "swirl|0.5;(ease:power4);x:110%,85%;y:110%,70%;alpha:0,1|1;(repeat:-1);rotation:0,360",
                        },
                        {
                            name: "swirl_e",
                            syntax: "swirl|0.5;(ease:power4);x:-10%,25%;y:0%,15%;alpha:0,1|1;(repeat:-1);rotation:0,360",
                        },
                        {
                            name: "swirl_f",
                            syntax: "swirl|0.5;(ease:power4);x:-10%,15%;y:0%,38%;alpha:0,1|1;(repeat:-1);rotation:0,360",
                        },
                        {
                            name: "swirl_g",
                            syntax: "swirl|0.5;(ease:power4);x:-10%,20%;y:110%,55%;alpha:0,1|1;(repeat:-1);rotation:0,360",
                        },
                        {
                            name: "swirl_h",
                            syntax: "swirl|0.5;(ease:power4);x:-10%,35%;y:110%,67%;alpha:0,1|1;(repeat:-1);rotation:0,360",
                        },
                        {
                            name: "swirl_i",
                            syntax: "swirl|0.5;(ease:power4);x:-10%,10%;y:110%,85%;alpha:0,1|1;(repeat:-1);rotation:0,360",
                        },
                        {
                            name: "swirl_j",
                            syntax: "swirl|0.5;(ease:power4);x:-10%,45%;y:110%,95%;alpha:0,1|1;(repeat:-1);rotation:0,360",
                        },
                        {
                            name: "swirl_k",
                            syntax: "swirl|0.5;(ease:power4);x:110%,95%;y:110%,90%;alpha:0,1|1;(repeat:-1);rotation:0,360",
                        },
                        {
                            name: "swirl_l",
                            syntax: "swirl|0.5;(ease:power4);x:110%,70%;y:110%,82%;alpha:0,1|1;(repeat:-1);rotation:0,360",
                        },
                    ],
                },
            },
            cry: {
                name: "cry",
                fatype: "far",
                faname: "fa-sad-cry",
                label: game.i18n.localize("Theatre.Emote.Cry"),
                rigging: {
                    animations: [
                        { name: "cry", syntax: "cry|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "tears_a",
                            syntax: "tears|0.5;(repeat:-1,repeatDelay:0.7);x:60%,110%;y:25%,40%;rotation:-30,-30;alpha:0.5,0|0;scaleX:-1,-1",
                        },
                        {
                            name: "tears_b",
                            syntax: "tears|0.5;(repeat:-1,repeatDelay:0.3);x:40%,-10%;y:25%,40%;rotation:30,30;alpha:0.5,0",
                        },
                        {
                            name: "tears_c",
                            syntax: "tears|0.5;(repeat:-1,repeatDelay:0.8);x:60%,90%;y:25%,50%;rotation:-10,-10;alpha:0.5,0|0;scaleX:-1,-1",
                        },
                        {
                            name: "tears_d",
                            syntax: "tears|0.5;(repeat:-1,repeatDelay:1.0);x:40%,10%;y:25%,50%;rotation:10,10;alpha:0.5,0",
                        },
                        {
                            name: "tears_e",
                            syntax: "tears|0.5;(repeat:-1,repeatDelay:0.2);x:60%,90%;y:25%,30%;rotation:-50,-50;alpha:0.5,0|0;scaleX:-1,-1",
                        },
                        {
                            name: "tears_f",
                            syntax: "tears|0.5;(repeat:-1,repeatDelay:1.2);x:40%,10%;y:25%,30%;rotation:50,50;alpha:0.5,0",
                        },
                    ],
                },
            },
            serious: {
                name: "serious",
                fatype: "far",
                faname: "fa-meh-rolling-eyes",
                image: "modules/vino/assets/emotes/serious.png",
                label: game.i18n.localize("Theatre.Emote.Serious"),
                rigging: {
                    animations: [{ name: "serious", syntax: "serious|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" }],
                },
            },
            annoyed: {
                name: "annoyed",
                fatype: "far",
                faname: "fa-meh-rolling-eyes",
                label: game.i18n.localize("Theatre.Emote.Annoyed"),
                rigging: {
                    animations: [
                        { name: "annoyed", syntax: "annoyed|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "ziggy",
                            syntax: "ziggy|0;x:25%,25%;y:20%,20%|0.25;(repeat:-1,yoyo:true);rotation:-2,2",
                        },
                        {
                            name: "ziggy_2",
                            syntax: "ziggy|1;(repeat:-1,delay:1,repeatDelay:2);scaleX:1,2;scaleY:1,2;x:25%,25%;y:20%,20%;alpha:0.5,0|0.25;(repeat:-1,yoyo:true);rotation:0,5",
                        },
                    ],
                },
            },
            frustrated: {
                name: "frustrated",
                fatype: "far",
                faname: "fa-meh-rolling-eyes",
                image: "modules/vino/assets/emotes/frustrated.png",
                label: game.i18n.localize("Theatre.Emote.Frustrated"),
                rigging: {
                    animations: [
                        { name: "frustrated", syntax: "frustrated|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "veins",
                            syntax: "veins|0.5;x:45%,45%;y:10%,10%;alpha:0,1|1;(repeat:-1,yoyo:true,ease:bounce);scaleX:0.7,1;scaleY:0.7,1",
                        },
                    ],
                },
            },
            angry: {
                name: "angry",
                fatype: "far",
                faname: "fa-angry",
                label: game.i18n.localize("Theatre.Emote.Angry"),
                rigging: {
                    animations: [
                        { name: "angry", syntax: "angry|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "veins",
                            syntax: "veins_red|0.5;x:45%,45%;y:10%,10%;alpha:0,1|1;(repeat:-1,yoyo:true,ease:elastic);scaleX:0.5,1;scaleY:0.5,1|0.25;(repeat:-1,yoyo:true);rotation:0,10",
                        },
                        {
                            name: "puff_a",
                            syntax: "puff|0;x:80%,80%;y:15%,15%;rotation:0,0|1;(repeat:-1,delay:1,yoyo:true,ease:power4);scaleX:0.3,1;scaleY:0.3,1;alpha:0,0.5",
                        },
                        {
                            name: "puff_b",
                            syntax: "puff|0;x:20%,20%;y:15%,15%;rotation:0,0|1;(repeat:-1,delay:1.5,yoyo:true,ease:power4);scaleX:-0.3,-1;scaleY:0.3,1;alpha:0,0.5",
                        },
                        {
                            name: "puff_c",
                            syntax: "puff|0;x:70%,70%;y:5%,5%;rotation:330,330|1;(repeat:-1,delay:2,yoyo:true,ease:power4);scaleX:0.3,1;scaleY:0.3,1;alpha:0,0.5",
                        },
                        {
                            name: "puff_d",
                            syntax: "puff|0;x:30%,30%;y:5%,5%;rotation:30,30|1;(repeat:-1,delay:2.5,yoyo:true,ease:power4);scaleX:-0.3,-1;scaleY:0.3,1;alpha:0,0.5",
                        },
                    ],
                },
            },
            laughing: {
                name: "laughing",
                fatype: "far",
                faname: "fa-laugh-beam",
                label: game.i18n.localize("Theatre.Emote.Laughing"),
                rigging: {
                    animations: [
                        { name: "laughing", syntax: "laughing|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "semiloud",
                            syntax: "semiloud|0.5;x:25%,25%;y:20%,20%;alpha:0,1|0.5;(ease:bounce);scaleX:0.1,1;scaleY:0.1,1|0.25;(repeat:-1,yoyo:true);rotation:-1,1",
                        },
                    ],
                },
            },
            laughingsquint: {
                name: "laughingsquint",
                fatype: "far",
                faname: "fa-laugh-squint",
                label: game.i18n.localize("Theatre.Emote.LaughingSquint"),
                rigging: {
                    animations: [
                        {
                            name: "laughingsquint",
                            syntax: "laughingsquint|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1",
                        },
                        {
                            name: "loud",
                            syntax: "loud|0.5;x:25%,25%;y:20%,20%;alpha:0,1|0.5;(ease:bounce);scaleX:0.1,1;scaleY:0.1,1|0.125;(repeat:-1,yoyo:true);rotation:-1,1",
                        },
                    ],
                },
            },
            rofl: {
                name: "rofl",
                fatype: "far",
                faname: "fa-grin-squint-tears",
                label: game.i18n.localize("Theatre.Emote.ROFL"),
                rigging: {
                    animations: [
                        { name: "rofl", syntax: "rofl|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "loud_a",
                            syntax: "loud|0.5;(ease:bounce);x:20%,20%;y:20%,20%;scaleX:0.1,1;scaleY:0.1,1|0.125;(repeat:-1,yoyo:true);rotation:-2,2",
                        },
                        {
                            name: "loud_b",
                            syntax: "loud|0.5;(ease:bounce);x:80%,80%;y:20%,20%;scaleX:-0.1,-1;scaleY:0.1,1|0.125;(repeat:-1,yoyo:true);rotation:-2,2",
                        },
                        {
                            name: "loud_c",
                            syntax: "loud|0;x:20%,20%;y:20%,20%|0.125;(repeat:-1,yoyo:true);rotation:-2,2|1;(repeat:-1);scaleX:1,1.5;scaleY:1,2;alpha:0.25,0",
                        },
                        {
                            name: "loud_d",
                            syntax: "loud|0;x:80%,80%;y:20%,20%|0.125;(repeat:-1,yoyo:true);rotation:-2,2|1;(repeat:-1);scaleX:-1,-1.5;scaleY:1,2;alpha:0.25,0",
                        },
                        {
                            name: "tears_a",
                            syntax: "tears|0.5;(repeat:-1,repeatDelay:1.7);x:60%,110%;y:25%,40%;rotation:-30,-30;alpha:0.5,0|0;scaleX:-1,-1",
                        },
                        {
                            name: "tears_b",
                            syntax: "tears|0.5;(repeat:-1,repeatDelay:0.8);x:40%,-10%;y:25%,40%;rotation:30,30;alpha:0.5,0",
                        },
                    ],
                },
            },
            worried: {
                name: "worried",
                fatype: "far",
                faname: "fa-grin-beam-sweat",
                label: game.i18n.localize("Theatre.Emote.Worried"),
                rigging: {
                    animations: [
                        { name: "worried", syntax: "worried|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        { name: "sweatdrop", syntax: "sweatdrop|2;(ease:bounce);x:30%,30%;y:0%,25%;alpha:0,1" },
                    ],
                },
            },
            surprised: {
                name: "surprised",
                fatype: "far",
                faname: "fa-surprise",
                label: game.i18n.localize("Theatre.Emote.Surprised"),
                rigging: {
                    animations: [
                        { name: "surprised", syntax: "surprised|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "notice",
                            syntax: "notice|0.5;x:25%,25%;y:20%,20%;alpha:0,1|0.5;(ease:bounce);scaleX:0.1,1;scaleY:0.1,1",
                        },
                    ],
                },
            },
            "awe-struck": {
                name: "awe-struck",
                fatype: "far",
                faname: "fa-grin-stars",
                label: game.i18n.localize("Theatre.Emote.Awe-Struck"),
                rigging: {
                    animations: [
                        { name: "awe-struck", syntax: "awe-struck|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "glimmer_a",
                            syntax: "glimmer|0.5;x:10%,10%;y:58%,58%|0.5;(delay:0.2,repeat:-1,yoyo:true);scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "glimmer_b",
                            syntax: "glimmer|0.5;x:85%,85%;y:20%,20%|0.5;(delay:0.3,repeat:-1,yoyo:true);scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "glimmer_c",
                            syntax: "glimmer|0.5;x:40%,40%;y:45%,45%|0.5;(delay:0.5,repeat:-1,yoyo:true);scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "glimmer_d",
                            syntax: "glimmer|0.5;x:35%,35%;y:30%,30%|0.5;(delay:0.6,repeat:-1,yoyo:true);scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "glimmer_e",
                            syntax: "glimmer|0.5;x:65%,65%;y:35%,35%|0.5;(delay:0.4,repeat:-1,yoyo:true);scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "glimmer_f",
                            syntax: "glimmer|0.5;x:80%,80%;y:50%,50%|0.5;(delay:0.1,repeat:-1,yoyo:true);scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "glimmer_g",
                            syntax: "glimmer|0.5;x:16%,16%;y:81%,81%|0.5;(delay:0.8,repeat:-1,yoyo:true);scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "glimmer_h",
                            syntax: "glimmer|0.5;x:55%,55%;y:64%,64%|0.5;(delay:0.9,repeat:-1,yoyo:true);scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "glimmer_i",
                            syntax: "glimmer|0.5;x:44%,44%;y:95%,95%|0.5;(delay:0.7,repeat:-1,yoyo:true);scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "glimmer_j",
                            syntax: "glimmer|0.5;x:67%,67%;y:84%,84%|0.5;(delay:0.35,repeat:-1,yoyo:true);scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "glimmer_k",
                            syntax: "glimmer|0.5;x:44%,44%;y:70%,70%|0.5;(delay:0,repeat:-1,yoyo:true);scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "glimmer_l",
                            syntax: "glimmer|0.5;x:20%,20%;y:23%,23%|0.5;(delay:0.65,repeat:-1,yoyo:true);scaleX:0.0,1;scaleY:0.0,1",
                        },
                    ],
                },
            },
            blushing: {
                name: "blushing",
                fatype: "far",
                faname: "fa-flushed",
                label: game.i18n.localize("Theatre.Emote.Blushing"),
                rigging: {
                    animations: [
                        { name: "blushing", syntax: "blushing|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "blush",
                            syntax: "blush|0.5;x:25%,25%;y:25%,25%|2;(ease:sineInOut,repeat:-1,yoyo:true);scaleX:0.9,1;scaleY:0.9,1;alpha:0.5,1|0.5;(repeat:-1,yoyo:true);rotation:-3,3",
                        },
                    ],
                },
            },
            hearts: {
                name: "hearts",
                fatype: "far",
                faname: "fa-grin-hearts",
                label: game.i18n.localize("Theatre.Emote.Hearts"),
                rigging: {
                    animations: [
                        { name: "hearts", syntax: "hearts|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "heart_a",
                            syntax: "heart|2;(repeat:-1,delay:1.3);y:110%,-10%;alpha:1,0|0.5;(delay:0.1,repeat:-1,yoyo:true);x:5%,10%|0.25;(delay:0.2,repeat:-1,yoyo:true,ease:bounce);scaleX:0.8,1;scaleY:0.8,1",
                        },
                        {
                            name: "heart_b",
                            syntax: "heart|2;(repeat:-1,delay:0.3);y:110%,-10%;alpha:1,0|0.5;(delay:0.9,repeat:-1,yoyo:true);x:5%,10%|0.25;(delay:0.2,repeat:-1,yoyo:true,ease:bounce);scaleX:0.8,1;scaleY:0.8,1",
                        },
                        {
                            name: "heart_c",
                            syntax: "heart|2;(repeat:-1,delay:0.8);y:110%,-10%;alpha:1,0|0.5;(delay:0.2,repeat:-1,yoyo:true);x:15%,20%|0.25;(delay:0.2,repeat:-1,yoyo:true,ease:bounce);scaleX:0.8,1;scaleY:0.8,1",
                        },
                        {
                            name: "heart_d",
                            syntax: "heart|2;(repeat:-1,delay:0.5);y:110%,-10%;alpha:1,0|0.5;(delay:0.8,repeat:-1,yoyo:true);x:25%,30%|0.25;(delay:0.2,repeat:-1,yoyo:true,ease:bounce);scaleX:0.8,1;scaleY:0.8,1",
                        },
                        {
                            name: "heart_e",
                            syntax: "heart|2;(repeat:-1,delay:1.7);y:110%,-10%;alpha:1,0|0.5;(delay:0.3,repeat:-1,yoyo:true);x:35%,40%|0.25;(delay:0.2,repeat:-1,yoyo:true,ease:bounce);scaleX:0.8,1;scaleY:0.8,1",
                        },
                        {
                            name: "heart_f",
                            syntax: "heart|2;(repeat:-1,delay:2);y:110%,-10%;alpha:1,0|0.5;(delay:0.7,repeat:-1,yoyo:true);x:45%,50%|0.25;(delay:0.2,repeat:-1,yoyo:true,ease:bounce);scaleX:0.8,1;scaleY:0.8,1",
                        },
                        {
                            name: "heart_g",
                            syntax: "heart|2;(repeat:-1,delay:1.5);y:110%,-10%;alpha:1,0|0.5;(delay:0.4,repeat:-1,yoyo:true);x:55%,60%|0.25;(delay:0.2,repeat:-1,yoyo:true,ease:bounce);scaleX:0.8,1;scaleY:0.8,1",
                        },
                        {
                            name: "heart_h",
                            syntax: "heart|2;(repeat:-1,delay:0.7);y:110%,-10%;alpha:1,0|0.5;(delay:0.6,repeat:-1,yoyo:true);x:65%,70%|0.25;(delay:0.2,repeat:-1,yoyo:true,ease:bounce);scaleX:0.8,1;scaleY:0.8,1",
                        },
                        {
                            name: "heart_i",
                            syntax: "heart|2;(repeat:-1,delay:1.7);y:110%,-10%;alpha:1,0|0.5;(delay:0.5,repeat:-1,yoyo:true);x:75%,80%|0.25;(delay:0.2,repeat:-1,yoyo:true,ease:bounce);scaleX:0.8,1;scaleY:0.8,1",
                        },
                        {
                            name: "heart_j",
                            syntax: "heart|2;(repeat:-1,delay:0.4);y:110%,-10%;alpha:1,0|0.5;(delay:0.35,repeat:-1,yoyo:true);x:85%,90%|0.25;(delay:0.2,repeat:-1,yoyo:true,ease:bounce);scaleX:0.8,1;scaleY:0.8,1",
                        },
                        {
                            name: "heart_k",
                            syntax: "heart|2;(repeat:-1,delay:2.3);y:110%,-10%;alpha:1,0|0.5;(delay:0.25,repeat:-1,yoyo:true);x:95%,100%|0.25;(delay:0.2,repeat:-1,yoyo:true,ease:bounce);scaleX:0.8,1;scaleY:0.8,1",
                        },
                    ],
                },
            },
            kiss: {
                name: "kiss",
                fatype: "far",
                faname: "fa-kiss-wink-heart",
                label: game.i18n.localize("Theatre.Emote.Kiss"),
                rigging: {
                    animations: [
                        { name: "kiss", syntax: "kiss|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "blowkiss",
                            syntax: "heart|4;(ease:expo);x:45%,-10%;alpha:1,0|0.25;(repeat:6,yoyo:true);y:25%,30%|0.25;(repeat:6,yoyo:true,ease:power4);scaleX:0.8,1.5;scaleY:0.8,1.5",
                        },
                    ],
                },
            },
            thinking: {
                name: "thinking",
                fatype: "far",
                faname: "fa-blank",
                image: "modules/vino/assets/emotes/thinking.png",
                label: game.i18n.localize("Theatre.Emote.Thinking"),
                rigging: {
                    animations: [
                        { name: "thinking", syntax: "thinking|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "thoughtbubble",
                            syntax: "thoughtbubble|0.5;(ease:power3);x:25%,25%;y:10%,10%;alpha:0,1|0.5;(repeat:-1,yoyo:true);scaleX:0.95,1;scaleY:0.95,1",
                        },
                        {
                            name: "bubbledot_a",
                            syntax: "bubbledot|0.5;(ease:power3);x:28%,28%;y:18%,18%;alpha:0,1|1;(repeat:-1,yoyo:true,repeatDelay:0.3);scaleX:0.5,1;scaleY:0.5,1|5;(repeat:-1);rotation:0,360",
                        },
                        {
                            name: "bubbledot_b",
                            syntax: "bubbledot|0.5;(ease:power3);x:31%,31%;y:21%,21%;alpha:0,1|1;(repeat:-1,yoyo:true,repeatDelay:0.1);scaleX:0.5,1;scaleY:0.5,1|5;(repeat:-1);rotation:0,360",
                        },
                        {
                            name: "bubbledot_c",
                            syntax: "bubbledot|0.5;(ease:power3);x:34%,34%;y:24%,24%;alpha:0,1|1;(repeat:-1,yoyo:true,repeatDelay:0.5);scaleX:0.5,1;scaleY:0.5,1|5;(repeat:-1);rotation:0,360",
                        },
                    ],
                },
            },
            confused: {
                name: "confused",
                fatype: "far",
                faname: "fa-question-circle",
                image: "modules/vino/assets/emotes/confused.png",
                label: game.i18n.localize("Theatre.Emote.Confused"),
                rigging: {
                    animations: [
                        { name: "confused", syntax: "confused|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "scribbleball",
                            syntax: "scribbleball|0.5;(ease:bounce);scaleX:0.1,1;scaleY:0.1,1;x:45%,45%;y:0%,0%;alpha:0,1|0.25;(repeat:-1,yoyo:true);rotation:0,5",
                        },
                    ],
                },
            },
            idea: {
                name: "idea",
                fatype: "far",
                faname: "fa-lightbulb",
                image: "modules/vino/assets/emotes/idea.png",
                label: game.i18n.localize("Theatre.Emote.Idea"),
                rigging: {
                    animations: [
                        { name: "idea", syntax: "idea|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "lightbulb",
                            syntax: "lightbulb|0.5;(ease:bounce);x:50%,50%;y:-10%,-10%;alpha:0,1|0.25;(repeat:-1,yoyo:true);rotation:0,5|1;(repeat:-1,yoyo:true);scaleX:1,1.3;scaleY:1,1.3",
                        },
                    ],
                },
            },
            meh: {
                name: "meh",
                fatype: "far",
                faname: "fa-meh",
                label: game.i18n.localize("Theatre.Emote.Meh"),
                rigging: {
                    animations: [
                        { name: "meh", syntax: "meh|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "sigh",
                            syntax: "sigh|3;(ease:power2);x:30%,10%;y:25%,45%;alpha:1,0;rotation:225,225;scaleX:1,1.5;scaleY:1,1.5",
                        },
                    ],
                },
            },
            smug: {
                name: "smug",
                fatype: "far",
                faname: "fa-grin-tongue-wink",
                image: "modules/vino/assets/emotes/smug.png",
                label: game.i18n.localize("Theatre.Emote.Smug"),
                rigging: {
                    animations: [{ name: "smug", syntax: "smug|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" }],
                },
            },
            wink: {
                name: "wink",
                fatype: "far",
                faname: "fa-grin-wink",
                label: game.i18n.localize("Theatre.Emote.Wink"),
                rigging: {
                    animations: [
                        { name: "wink", syntax: "wink|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "kawaii_a",
                            syntax: "star|4;(ease:expo);x:45%,-10%;y:25%,25%;alpha:1,0|2;(repeat:4);rotation:0,360",
                        },
                        {
                            name: "kawaii_b",
                            syntax: "star|3;(ease:expo);x:45%,10%;y:25%,12%;alpha:1,0|2;(repeat:4);rotation:0,360",
                        },
                        {
                            name: "kawaii_c",
                            syntax: "star|3;(ease:expo);x:45%,10%;y:25%,38%;alpha:1,0|2;(repeat:4);rotation:0,360",
                        },
                    ],
                },
            },
            tongue: {
                name: "tongue",
                fatype: "far",
                faname: "fa-grin-tongue",
                label: game.i18n.localize("Theatre.Emote.Tongue"),
                rigging: {
                    animations: [
                        { name: "tongue", syntax: "tongue|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "kawaii",
                            syntax: "star|4;(ease:expo,delay:2);x:30%,30%;y:25%,25%;alpha:1,0;scaleX:1.3,0.1;scaleY:1.3,0.1|2;(repeat:4);rotation:0,360",
                        },
                    ],
                },
            },
            playful: {
                name: "playful",
                fatype: "far",
                faname: "fa-grin-tongue-wink",
                label: game.i18n.localize("Theatre.Emote.Playful"),
                rigging: {
                    animations: [
                        { name: "playful", syntax: "playful|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "kawaii_a",
                            syntax: "star|3;(ease:expo);x:40%,-10%;y:25%,-15%;alpha:1,0|2;(repeat:4);rotation:0,360",
                        },
                        {
                            name: "kawaii_b",
                            syntax: "star|4;(ease:expo);x:40%,-40%;y:25%,30%;alpha:1,0|2;(repeat:4);rotation:0,360",
                        },
                        {
                            name: "kawaii_c",
                            syntax: "star|3;(ease:expo);x:40%,-10%;y:25%,55%;alpha:1,0|2;(repeat:4);rotation:0,360",
                        },
                        {
                            name: "kawaii_d",
                            syntax: "star|3;(ease:expo);x:60%,110%;y:25%,-15%;alpha:1,0|2;(repeat:4);rotation:0,360",
                        },
                        {
                            name: "kawaii_e",
                            syntax: "star|4;(ease:expo);x:60%,140%;y:25%,30%;alpha:1,0|2;(repeat:4);rotation:0,360",
                        },
                        {
                            name: "kawaii_f",
                            syntax: "star|3;(ease:expo);x:60%,110%;y:25%,55%;alpha:1,0|2;(repeat:4);rotation:0,360",
                        },
                        {
                            name: "kawaii_g",
                            syntax: "star|4;(ease:expo);x:50%,50%;y:15%,-35%;alpha:1,0|2;(repeat:4);rotation:0,360",
                        },
                        {
                            name: "kawaii_h",
                            syntax: "star|4;(ease:expo);x:50%,50%;y:35%,85%;alpha:1,0|2;(repeat:4);rotation:0,360",
                        },
                    ],
                },
            },
            mischevious: {
                name: "mischevious",
                fatype: "fas",
                faname: "fa-book-dead",
                image: "modules/vino/assets/emotes/evil.png",
                label: game.i18n.localize("Theatre.Emote.Mischevious"),
                rigging: {
                    animations: [
                        { name: "evil", syntax: "evil|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        { name: "shroud", syntax: "darkness|0;x:50%,50%;y:50%,50%" },
                        {
                            name: "miasma_a",
                            syntax: "miasma|0;x:25%,25%;y:78%,78%|3;(repeat:-1,delay:0.3);alpha:1,0;scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "miasma_b",
                            syntax: "miasma|0;x:73%,73%;y:68%,68%|3;(repeat:-1,delay:1.3);alpha:1,0;scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "miasma_c",
                            syntax: "miasma|0;x:15%,15%;y:60%,60%|3;(repeat:-1,delay:0.8);alpha:1,0;scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "miasma_d",
                            syntax: "miasma|0;x:45%,45%;y:85%,85%|3;(repeat:-1,delay:2.6);alpha:1,0;scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "miasma_e",
                            syntax: "miasma|0;x:90%,90%;y:80%,80%|3;(repeat:-1,delay:3.5);alpha:1,0;scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "miasma_f",
                            syntax: "miasma|0;x:55%,55%;y:60%,60%|3;(repeat:-1,delay:2.1);alpha:1,0;scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "miasma_g",
                            syntax: "miasma|0;x:10%,10%;y:90%,90%|3;(repeat:-1,delay:3.8);alpha:1,0;scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "miasma_h",
                            syntax: "miasma|0;x:95%,95%;y:70%,70%|3;(repeat:-1,delay:1.8);alpha:1,0;scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "miasma_i",
                            syntax: "miasma|0;x:50%,50%;y:72%,72%|3;(repeat:-1,delay:5.8);alpha:1,0;scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "miasma_j",
                            syntax: "miasma|0;x:10%,10%;y:66%,66%|3;(repeat:-1,delay:3.6);alpha:1,0;scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "miasma_k",
                            syntax: "miasma|0;x:3%,3%;y:88%,88%|3;(repeat:-1,delay:2.2);alpha:1,0;scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "miasma_l",
                            syntax: "miasma|0;x:78%,78%;y:75%,75%|3;(repeat:-1,delay:1.7);alpha:1,0;scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "miasma_m",
                            syntax: "miasma|0;x:65%,65%;y:98%,98%|3;(repeat:-1,delay:.7);alpha:1,0;scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "miasma_n",
                            syntax: "miasma|0;x:33%,33%;y:78%,78%|3;(repeat:-1,delay:4.4);alpha:1,0;scaleX:0.0,1;scaleY:0.0,1",
                        },
                        {
                            name: "miasma_o",
                            syntax: "miasma|0;x:80%,80%;y:92%,92%|3;(repeat:-1,delay:5.2);alpha:1,0;scaleX:0.0,1;scaleY:0.0,1",
                        },
                    ],
                },
            },
            innocent: {
                name: "innocent",
                fatype: "fas",
                faname: "fa-book-dead",
                image: "modules/vino/assets/emotes/innocent.png",
                label: game.i18n.localize("Theatre.Emote.Innocent"),
                rigging: {
                    animations: [
                        { name: "innocent", syntax: "innocent|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "halo",
                            syntax: "halo|2;(ease:power2);x:50%,50%;alpha:0,1|2;(ease:sine,repeat:-1,yoyo:true,yoyoEase:sine);y:-3%,-5%",
                        },
                    ],
                },
            },
            carefree: {
                name: "carefree",
                fatype: "fas",
                faname: "fa-book-dead",
                image: "modules/vino/assets/emotes/carefree.png",
                label: game.i18n.localize("Theatre.Emote.CareFree"),
                rigging: {
                    animations: [
                        { name: "carefree", syntax: "carefree|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "musicnote_a",
                            syntax: "musicnote|0.5;(ease:bounce);scaleX:0.1,1;scaleY:0.1,1;x:10%,10%;alpha:0,1|0.25;(repeat:-1,yoyo:true);rotation:-10,10|1;(ease:sine,yoyo:true,yoyoEase:sine,repeat:-1);y:20%,30%",
                        },
                        {
                            name: "musicnote_b",
                            syntax: "musicnote|0.5;(ease:bounce);scaleX:0.1,1;scaleY:0.1,1;x:20%,20%;alpha:0,1|0.25;(repeat:-1,yoyo:true);rotation:-10,10|1;(ease:sine,yoyo:true,yoyoEase:sine,repeat:-1,delay:0.25);y:15%,25%",
                        },
                        {
                            name: "musicnote_c",
                            syntax: "musicnote|0.5;(ease:bounce);scaleX:0.1,1;scaleY:0.1,1;x:30%,30%;alpha:0,1|0.25;(repeat:-1,yoyo:true);rotation:-10,10|1;(ease:sine,yoyo:true,yoyoEase:sine,repeat:-1,delay:0.5);y:20%,30%",
                        },
                    ],
                },
            },
            panic: {
                name: "panic",
                fatype: "far",
                faname: "fa-tired",
                label: game.i18n.localize("Theatre.Emote.Panic"),
                rigging: {
                    animations: [
                        { name: "panic", syntax: "panic|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "line_a",
                            syntax: "linesteep|0;x:50%,50%;y:-10%,-10%|1;(repeat:-1,yoyo:true);scaleX:0.5,1;scaleY:0.5,1",
                        },

                        {
                            name: "line_b",
                            syntax: "linesteep|0;x:35%,35%;y:-5%,-5%;rotation:-22.5,-22.5|1;(repeat:-1,yoyo:true);scaleX:0.5,1;scaleY:0.5,1",
                        },
                        {
                            name: "line_c",
                            syntax: "linesteep|0;x:15%,15%;y:5%,5%;rotation:-45,-45|1;(repeat:-1,yoyo:true);scaleX:0.5,1;scaleY:0.5,1",
                        },
                        {
                            name: "line_d",
                            syntax: "linesteep|0;x:0%,0%;y:20%,20%;rotation:-67.5,-67.5|1;(repeat:-1,yoyo:true);scaleX:0.5,1;scaleY:0.5,1",
                        },
                        {
                            name: "line_e",
                            syntax: "linesteep|0;x:-10%,-10%;y:30%,30%;rotation:-90,-90|1;(repeat:-1,yoyo:true);scaleX:0.5,1;scaleY:0.5,1",
                        },

                        {
                            name: "line_f",
                            syntax: "linesteep|0;x:65%,65%;y:-5%,-5%;rotation:22.5,22.5|1;(repeat:-1,yoyo:true);scaleX:0.5,1;scaleY:0.5,1",
                        },
                        {
                            name: "line_g",
                            syntax: "linesteep|0;x:85%,85%;y:5%,5%;rotation:45,45|1;(repeat:-1,yoyo:true);scaleX:0.5,1;scaleY:0.5,1",
                        },
                        {
                            name: "line_h",
                            syntax: "linesteep|0;x:100%,100%;y:20%,20%;rotation:67.5,67.5|1;(repeat:-1,yoyo:true);scaleX:0.5,1;scaleY:0.5,1",
                        },
                        {
                            name: "line_i",
                            syntax: "linesteep|0;x:110%,110%;y:30%,30%;rotation:90,90|1;(repeat:-1,yoyo:true);scaleX:0.5,1;scaleY:0.5,1",
                        },
                    ],
                },
            },
            dizzy: {
                name: "dizzy",
                fatype: "far",
                faname: "fa-dizzy",
                label: game.i18n.localize("Theatre.Emote.Dizzy"),
                rigging: {
                    animations: [
                        { name: "dizzy", syntax: "dizzy|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "stars_a",
                            syntax: "star|2;(ease:sineInOut,repeat:-1,yoyo:true);x:10%,90%;y:35%,5%|1;(repeatDelay:1,repeat:-1,yoyo:true);scaleX:0.2,1;scaleY:0.2,1;alpha:0.2,1|2;(repeat:-1);rotation:0,360",
                        },
                        {
                            name: "stars_b",
                            syntax: "star|2;(ease:sineInOut,repeat:-1,yoyo:true);x:90%,10%;y:5%,35%|1;(repeatDelay:1,repeat:-1,yoyo:true);scaleX:1,0.2;scaleY:1,0.2;alpha:1,0.2|2;(repeat:-1);rotation:0,360",
                        },
                        {
                            name: "stars_c",
                            syntax: "star|2;(ease:sineInOut,repeat:-1,yoyo:true,delay:1);x:10%,90%;y:5%,35%|1;(repeatDelay:1,delay:1,repeat:-1,yoyo:true);scaleX:0.2,1;scaleY:0.2,1;alpha:0.2,1|2;(repeat:-1);rotation:0,360",
                        },
                        {
                            name: "stars_d",
                            syntax: "star|2;(ease:sineInOut,repeat:-1,yoyo:true,delay:1);x:90%,10%;y:35%,5%|1;(repeatDelay:1,delay:1,repeat:-1,yoyo:true);scaleX:1,0.2;scaleY:1,0.2;alpha:1,0.2|2;(repeat:-1);rotation:0,360",
                        },
                    ],
                },
            },
            speechless: {
                name: "speechless",
                fatype: "far",
                faname: "fa-comment-dots",
                image: "modules/vino/assets/emotes/speechless.png",
                label: game.i18n.localize("Theatre.Emote.Speechless"),
                rigging: {
                    animations: [
                        { name: "speechless", syntax: "speechless|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "dot_a",
                            syntax: "dot|0.5;(ease:power3);x:30%,30%;y:25%,25%;alpha:0,1|1;(ease:bounce,repeat:-1,delay:0,repeatDelay:3,yoyo:true,yoyoEase:power0);scaleX:0.5,1;scaleY:0.5,1",
                        },
                        {
                            name: "dot_b",
                            syntax: "dot|0.5;(ease:power3);x:25%,25%;y:25%,25%;alpha:0,1|1;(ease:bounce,repeat:-1,delay:1,repeatDelay:3,yoyo:true,yoyoEase:power0);scaleX:0.5,1;scaleY:0.5,1",
                        },
                        {
                            name: "dot_c",
                            syntax: "dot|0.5;(ease:power3);x:20%,20%;y:25%,25%;alpha:0,1|1;(ease:bounce,repeat:-1,delay:2,repeatDelay:3,yoyo:true,yoyoEase:power0);scaleX:0.5,1;scaleY:0.5,1",
                        },
                    ],
                },
            },
            scared: {
                name: "scared",
                fatype: "far",
                faname: "fa-grimace",
                label: game.i18n.localize("Theatre.Emote.Scared"),
                rigging: {
                    animations: [
                        { name: "scared", syntax: "scared|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "ghostball_a",
                            syntax: "ghostball1|0;x:70%,70%|1;(ease:sine,yoyoEase:sine,repeat:-1,yoyo:true,delay:0.5);y:30%,35%;scaleX:0.8,1;scaleY:0.8,1;alpha:0,1|0.25;(repeat:-1,yoyo:true);rotation:-5,5",
                        },
                        {
                            name: "ghostball_b",
                            syntax: "ghostball1|0;x:30%,30%|1;(ease:sine,yoyoEase:sine,repeat:-1,yoyo:true,delay:1);y:10%,15%;scaleX:0.8,1;scaleY:0.8,1;alpha:0,1|0.25;(repeat:-1,yoyo:true);rotation:-5,5",
                        },
                        {
                            name: "ghostball_c",
                            syntax: "ghostball1|0;x:20%,20%|1;(ease:sine,yoyoEase:sine,repeat:-1,yoyo:true,delay:0.8);y:60%,65%;scaleX:0.8,1;scaleY:0.8,1;alpha:0,1|0.25;(repeat:-1,yoyo:true);rotation:-5,5",
                        },
                        {
                            name: "ghostball_d",
                            syntax: "ghostball2|0;x:85%,85%|1;(ease:sine,yoyoEase:sine,repeat:-1,yoyo:true,delay:0.4);y:75%,80%;scaleX:0.8,1;scaleY:0.8,1;alpha:0,1|0.25;(repeat:-1,yoyo:true);rotation:-5,5",
                        },
                        {
                            name: "ghostball_e",
                            syntax: "ghostball2|0;x:10%,10%|1;(ease:sine,yoyoEase:sine,repeat:-1,yoyo:true,delay:1.2);y:40%,45%;scaleX:0.8,1;scaleY:0.8,1;alpha:0,1|0.25;(repeat:-1,yoyo:true);rotation:-5,5",
                        },
                        {
                            name: "ghostball_f",
                            syntax: "ghostball2|0;x:60%,60%|1;(ease:sine,yoyoEase:sine,repeat:-1,yoyo:true,delay:0.6);y:80%,85%;scaleX:0.8,1;scaleY:0.8,1;alpha:0,1|0.25;(repeat:-1,yoyo:true);rotation:-5,5",
                        },
                        {
                            name: "ghostball_g",
                            syntax: "ghostball1|0;x:90%,90%|1;(ease:sine,yoyoEase:sine,repeat:-1,yoyo:true,delay:1.5);y:10%,15%;scaleX:0.8,1;scaleY:0.8,1;alpha:0,1|0.25;(repeat:-1,yoyo:true);rotation:-5,5",
                        },
                        {
                            name: "ghostball_h",
                            syntax: "ghostball2|0;x:75%,75%|1;(ease:sine,yoyoEase:sine,repeat:-1,yoyo:true,delay:0.9);y:50%,55%;scaleX:0.8,1;scaleY:0.8,1;alpha:0,1|0.25;(repeat:-1,yoyo:true);rotation:-5,5",
                        },
                    ],
                },
            },
            sleeping: {
                name: "sleeping",
                fatype: "fas",
                faname: "fa-bed",
                image: "modules/vino/assets/emotes/sleeping.png",
                label: game.i18n.localize("Theatre.Emote.Sleeping"),
                rigging: {
                    animations: [
                        { name: "sleeping", syntax: "sleeping|1;(ease:elastic);x:80%,80%;y:0%,25%;alpha:0,1" },
                        {
                            name: "zzz_a",
                            syntax: "zzz|4;(repeat:-1,delay:0);y:25%,-20%;alpha:0,1;scaleX:0.1,1;scaleY:0.1,1|1;(ease:sineInOut,repeat:-1,delay:0,yoyo:true);x:30%,40%",
                        },
                        {
                            name: "zzz_b",
                            syntax: "zzz|4;(repeat:-1,delay:1);y:25%,-20%;alpha:0,1;scaleX:0.1,1;scaleY:0.1,1|1;(ease:sineInOut,repeat:-1,delay:0.5,yoyo:true);x:30%,40%",
                        },
                        {
                            name: "zzz_c",
                            syntax: "zzz|4;(repeat:-1,delay:2);y:25%,-20%;alpha:0,1;scaleX:0.1,1;scaleY:0.1,1|1;(ease:sineInOut,repeat:-1,delay:1,yoyo:true);x:30%,40%",
                        },
                        {
                            name: "zzz_d",
                            syntax: "zzz|4;(repeat:-1,delay:3);y:25%,-20%;alpha:0,1;scaleX:0.1,1;scaleY:0.1,1|1;(ease:sineInOut,repeat:-1,delay:1.5,yoyo:true);x:30%,40%",
                        },
                    ],
                },
            },
        };
    }
}
