/* Account/bootstrap API service. */
(function(global){
  "use strict";
  const services = global.SouqiServices = global.SouqiServices || {};

  services.account = Object.freeze({
    bootstrap: function(){
      return global.SouqiAPI.get(
        (global.SOUQI_CONFIG.endpoints || {}).bootstrap || "/api/bootstrap"
      );
    },
    getProfile: function(){
      return global.SouqiAPI.get(
        (global.SOUQI_CONFIG.endpoints || {}).profile || "/api/profile"
      );
    }
  });
})(window);
