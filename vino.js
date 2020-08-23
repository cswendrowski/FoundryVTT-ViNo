import VNOverlay from './apps/VNOverlay.js';
// eslint-disable-next-line no-unused-vars
import constants from './constants.js';

(() => { })();

Hooks.once('init', async () => {

});

Hooks.once('canvasReady', async () => {
  VNOverlay.init();
  if (ui.vinoOverlay) ui.vinoOverlay.render();
});
