window.SOUQI_CONFIG = Object.freeze({
  // اترك demoMode=true لتشغيل الواجهة ببيانات المعاينة الحالية.
  // عند ربط الباك إند: ضع رابط الـ API وغيّرها إلى false.
  apiBaseUrl: "",
  demoMode: true,
  requestTimeoutMs: 12000,

  // جميع مسارات الباك إند معرفة في مكان واحد حتى لا تحتوي الصفحات على URLs صلبة.
  endpoints: Object.freeze({
    bootstrap: "/api/bootstrap",
    profile: "/api/profile",
    catalog: "/api/catalog",
    products: "/api/products",
    orders: "/api/orders",
    wallet: "/api/wallet",
    topup: "/api/wallet/topup",
    walletActivity: "/api/wallet/activity",
    transfers: "/api/wallet/transfers"
  })
});
