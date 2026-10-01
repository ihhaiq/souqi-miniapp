window.SOUQI_CONFIG = Object.freeze({
  // اترك demoMode=true لتشغيل الواجهة ببيانات المعاينة الحالية.
  // عند ربط الباك إند: ضع رابط الـ API وغيّرها إلى false.
  apiBaseUrl: "",
  demoMode: true,
  requestTimeoutMs: 12000,
  endpoints: Object.freeze({
    bootstrap: "/api/bootstrap",
    catalog: "/api/catalog",
    orders: "/api/orders",
    topup: "/api/wallet/topup"
  })
});
