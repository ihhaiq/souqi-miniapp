/* Orders API service. */
(function(global){
  "use strict";
  const services = global.SouqiServices = global.SouqiServices || {};

  services.orders = Object.freeze({
    list: function(query){
      return global.SouqiAPI.get(
        (global.SOUQI_CONFIG.endpoints || {}).orders || "/api/orders",
        query || {}
      );
    },
    create: function(payload){
      return global.SouqiAPI.post(
        (global.SOUQI_CONFIG.endpoints || {}).orders || "/api/orders",
        payload
      );
    }
  });
})(window);
