(function (global) {
  "use strict";

  const config = global.SOUQI_CONFIG || {};
  const endpoints = config.endpoints || {};
  const demoMode = config.demoMode !== false;
  const baseUrl = String(config.apiBaseUrl || "").replace(/\/$/, "");
  const timeoutMs = Number(config.requestTimeoutMs || 12000);

  function telegramInitData() {
    if (global.SouqiTelegram && typeof global.SouqiTelegram.getInitData === "function") {
      return global.SouqiTelegram.getInitData();
    }
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
      const configError = new Error("SOUQI_CONFIG.apiBaseUrl is empty");
      configError.code = "API_BASE_URL_EMPTY";
      throw configError;
    }

    const controller = new AbortController();
    const timer = setTimeout(function () { controller.abort(); }, timeoutMs);
    const headers = Object.assign(
      { "Accept": "application/json" },
      options.headers || {}
    );

    if (options.body !== undefined && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

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
      let payload = null;
      if (response.status !== 204) {
        payload = contentType.includes("application/json")
          ? await response.json()
          : await response.text();
      }

      if (!response.ok) {
        const error = new Error("API request failed with status " + response.status);
        error.status = response.status;
        error.payload = payload;
        throw error;
      }
      return payload;
    } catch (error) {
      if (error && error.name === "AbortError") {
        const timeoutError = new Error("API request timed out");
        timeoutError.code = "API_TIMEOUT";
        timeoutError.cause = error;
        throw timeoutError;
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  function get(path, query, options) {
    options = Object.assign({}, options || {}, { method: "GET", query: query });
    return request(path, options);
  }

  function post(path, body, options) {
    options = Object.assign({}, options || {}, { method: "POST", body: body });
    return request(path, options);
  }

  const api = {
    demoMode: demoMode,
    request: request,
    get: get,
    post: post,

    // Compatibility helpers kept while page code migrates to js/services/*.
    getBootstrap: function () {
      return get(endpoints.bootstrap || "/api/bootstrap");
    },
    getCatalog: function (category) {
      return get(endpoints.catalog || "/api/catalog", { category: category });
    },
    createOrder: function (payload) {
      return post(endpoints.orders || "/api/orders", payload);
    },
    createTopUp: function (payload) {
      return post(endpoints.topup || "/api/wallet/topup", payload);
    }
  };

  global.SouqiAPI = Object.freeze(api);
})(window);
