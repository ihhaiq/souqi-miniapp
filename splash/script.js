/**
 * Splash Screen Module Controller
 * Signature Yellow Design — Telegram Mini App Handshake
 */

window.SplashModule = {
  /**
   * Initializes the splash view lifecycle
   * @param {Object} options Configuration and callbacks
   * @param {Function} options.onComplete Callback invoked when splash finishes
   */
  async init(options = {}) {
    const statusEl = document.getElementById('splashStatus');
    const barEl = document.getElementById('splashProgressBar');
    const screenEl = document.getElementById('splashScreen');

    const updateStatus = (text, progressPercent) => {
      if (statusEl) {
        statusEl.style.opacity = '0';
        setTimeout(() => {
          statusEl.textContent = text;
          statusEl.style.opacity = '1';
        }, 120);
      }
      if (barEl && progressPercent !== undefined) {
        barEl.style.width = `${progressPercent}%`;
      }
    };

    try {
      const tg = window.Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        // Match Telegram header with the signature yellow theme during splash
        tg.setHeaderColor?.('#FFD200');
        tg.setBackgroundColor?.('#FFD200');
      }

      // Progress 1: Initialization
      updateStatus('جاري التحقق من بيانات تيليجرام...', 25);
      await this._delay(600);

      // Progress 2: Backend Handshake / Session
      updateStatus('جاري مزامنة الحساب والبيانات...', 65);
      await this._delay(700);

      // Progress 3: Complete
      updateStatus('جاهز للانطلاق!', 100);
      await this._delay(400);

      // Restore active theme for the main app views
      if (tg) {
        const currentTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('souqi_theme') || 'dark';
        const color = (currentTheme === 'light') ? '#F5F7FA' : '#121214';
        tg.setHeaderColor?.(color);
        tg.setBackgroundColor?.(color);
      }

      if (screenEl) {
        screenEl.classList.add('fade-out');
      }

      setTimeout(() => {
        if (typeof options.onComplete === 'function') {
          options.onComplete();
        }
      }, 350);

    } catch (err) {
      console.error('[Splash] Initialization error:', err);
      updateStatus('حدث خطأ أثناء الاتصال', 100);
      setTimeout(() => {
        if (typeof options.onComplete === 'function') {
          options.onComplete();
        }
      }, 1000);
    }
  },

  /**
   * Utility sleep delay
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};
