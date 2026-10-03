/* Catalog API service. Keeps HTTP details out of page/UI code. */
(function(global){
  "use strict";
  const services = global.SouqiServices = global.SouqiServices || {};

  services.catalog = Object.freeze({
    list: function(category, query){
      return global.SouqiAPI.get(
        (global.SOUQI_CONFIG.endpoints || {}).catalog || "/api/catalog",
        Object.assign({ category: category }, query || {})
      );
    },
    get: function(id){
      const base = (global.SOUQI_CONFIG.endpoints || {}).products || "/api/products";
      return global.SouqiAPI.get(base + "/" + encodeURIComponent(String(id)));
    }
  });
})(window);
