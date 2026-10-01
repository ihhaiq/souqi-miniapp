(function (global) {
  "use strict";

  const config = global.SOUQI_CONFIG || {};
  const endpoints = config.endpoints || {};
  const demoMode = config.demoMode !== false;
  const baseUrl = String(config.apiBaseUrl || "").replace(/\/$/, "");
  const timeoutMs = Number(config.requestTimeoutMs || 12000);

  function telegramInitData() {
    const tg = global.Telegram && global.Telegram.WebApp;
    return tg && typeof tg.initData === "string" ? tg.initData : "";
  }

  function buildUrl(path, query) {
    const url = baseUrl + path;
    if (!query) return url;
    const params = new URLSearchParams();
    Object.keys(query).forEach(function (key) {
      const value = query[key];
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    });
    const qs = params.toString();
    return qs ? url + "?" + qs : url;
  }

  async function request(path, options) {
    options = options || {};
    if (!baseUrl) {
      throw new Error("SOUQI_CONFIG.apiBaseUrl is empty");
    }

    const controller = new AbortController();
    const timer = setTimeout(function () { controller.abort(); }, timeoutMs);
    const headers = Object.assign(
      { "Accept": "application/json", "Content-Type": "application/json" },
      options.headers || {}
    );

    const initData = telegramInitData();
    if (initData) headers["X-Telegram-Init-Data"] = initData;

    try {
      const response = await fetch(buildUrl(path, options.query), {
        method: options.method || "GET",
        headers: headers,
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        credentials: "omit",
        signal: controller.signal
      });

      const contentType = response.headers.get("content-type") || "";
      const payload = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const error = new Error("API request failed with status " + response.status);
        error.status = response.status;
        error.payload = payload;
        throw error;
      }
      return payload;
    } finally {
      clearTimeout(timer);
    }
  }

  global.SouqiAPI = Object.freeze({
    demoMode: demoMode,

    getBootstrap: function () {
      return request(endpoints.bootstrap || "/api/bootstrap");
    },

    getCatalog: function (category) {
      return request(endpoints.catalog || "/api/catalog", {
        query: { category: category }
      });
    },

    createOrder: function (payload) {
      return request(endpoints.orders || "/api/orders", {
        method: "POST",
        body: payload
      });
    },

    createTopUp: function (payload) {
      return request(endpoints.topup || "/api/wallet/topup", {
        method: "POST",
        body: payload
      });
    }
  });
})(window);
