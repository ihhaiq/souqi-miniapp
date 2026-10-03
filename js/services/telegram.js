/* Telegram Mini App adapter.
   UI code reads Telegram through this module; backend auth still verifies initData server-side. */
(function(global){
  "use strict";

  function webApp(){
    return global.Telegram && global.Telegram.WebApp ? global.Telegram.WebApp : null;
  }

  function init(){
    const tg = webApp();
    if (!tg) return null;
    try { tg.ready(); } catch(e) {}
    try { tg.expand(); } catch(e) {}
    try { tg.setHeaderColor("#141414"); } catch(e) {}
    try { tg.setBackgroundColor("#141414"); } catch(e) {}
    try { tg.setBottomBarColor("#181818"); } catch(e) {}
    return tg;
  }

  function getUser(){
    const tg = webApp();
    return tg && tg.initDataUnsafe && tg.initDataUnsafe.user
      ? tg.initDataUnsafe.user
      : null;
  }

  function getInitData(){
    const tg = webApp();
    return tg && typeof tg.initData === "string" ? tg.initData : "";
  }

  function showAlert(message){
    const tg = webApp();
    if (tg && typeof tg.showAlert === "function") {
      tg.showAlert(String(message));
      return;
    }
    global.alert(String(message));
  }

  global.SouqiTelegram = Object.freeze({
    init: init,
    getWebApp: webApp,
    getUser: getUser,
    getInitData: getInitData,
    showAlert: showAlert
  });
})(window);
