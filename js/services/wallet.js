/* Wallet API service. */
(function(global){
  "use strict";
  const services = global.SouqiServices = global.SouqiServices || {};

  services.wallet = Object.freeze({
    get: function(){
      return global.SouqiAPI.get(
        (global.SOUQI_CONFIG.endpoints || {}).wallet || "/api/wallet"
      );
    },
    topUp: function(payload){
      return global.SouqiAPI.post(
        (global.SOUQI_CONFIG.endpoints || {}).topup || "/api/wallet/topup",
        payload
      );
    },
    activity: function(query){
      return global.SouqiAPI.get(
        (global.SOUQI_CONFIG.endpoints || {}).walletActivity || "/api/wallet/activity",
        query || {}
      );
    },
    transfers: function(query){
      return global.SouqiAPI.get(
        (global.SOUQI_CONFIG.endpoints || {}).transfers || "/api/wallet/transfers",
        query || {}
      );
    }
  });
})(window);
