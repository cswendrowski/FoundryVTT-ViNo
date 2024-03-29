


const API = {

    async show(token, options) {
        const tokenTmp = RetrieveHelpers.getTokenSync(token);

    }

  // =============================================
  // SOCKET SUPPORT
  // ============================================

//   async pullPlayerToSceneArr(...inAttributes) {
//     if (!Array.isArray(inAttributes)) {
//       throw error("pullToSceneArr | inAttributes must be of type array");
//     }
//     const [sceneId, userId] = inAttributes;
//     await game.socket?.emit("pullToScene", sceneId, userId);
//   },
};

export default API;
