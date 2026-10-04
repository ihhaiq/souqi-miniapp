/**
 * Master Application Orchestrator & Bidirectional Router
 * Handles forward & back navigation (ذهاب وإياب), Telegram native BackButton,
 * shared state coordination, and seamless transition from Splash to Market.
 */

window.App = {
  currentPage: 'market',
  history: [],
  state: {
    user: {
      id: 1,
      name: "Mrsalta3",
      username: "@mrsalta3",
      balance: 0,
      stars: 0
    },
    activeTab: 'market',
    cart: []
  },

  /**
   * Application Bootstrapping
   */
  init() {
    console.log('[App] Bootstrapping application...');
    this.initTelegram();
    this.bindGlobalNavigation();

    // Initialize Market Module directly in background
    if (window.MarketModule && typeof window.MarketModule.init === 'function') {
      window.MarketModule.init();
    }

    // Launch Splash Lifecycle
    if (window.SplashModule && typeof window.SplashModule.init === 'function') {
      window.SplashModule.init({
        onComplete: () => {
          this.onSplashComplete();
        }
      });
    } else {
      this.onSplashComplete();
    }
  },

  /**
   * Telegram WebApp SDK Configuration
   */
  initTelegram() {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      console.warn('[App] Running in standalone/browser mode.');
      return;
    }

    try {
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation?.();

      // Configure Native Telegram Back Button for backward navigation (الإياب)
      tg.BackButton.onClick(() => {
        this.goBack();
      });
    } catch (e) {
      console.error('[App] Telegram init error:', e);
    }
  },

  /**
   * Splash Lifecycle Completion Hook
   */
  onSplashComplete() {
    console.log('[App] Splash completed. Revealing Market view seamlessly.');
    const splashEl = document.getElementById('splashScreen');
    if (splashEl) {
      splashEl.classList.add('fade-out');
      setTimeout(() => {
        splashEl.style.display = 'none';
      }, 400);
    }

    // Update theme-color to Carbon Dark
    const metaTheme = document.getElementById('themeColorMeta');
    if (metaTheme) metaTheme.setAttribute('content', '#121214');

    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.setHeaderColor?.('#121214');
      tg.setBackgroundColor?.('#121214');
    }
  },

  /**
   * Bidirectional Router: Forward Navigation (الذهاب والتقدم)
   * @param {string} pageName Target page module name (e.g., 'market', 'product-details', 'orders')
   * @param {Object} [params] Parameters passed to the view
   */
  async navigate(pageName, params = {}) {
    if (!pageName) return;
    console.log(`[App] Navigating to: ${pageName}`, params);

    const marketWrapper = document.getElementById('marketPageWrapper');
    const subpageWrapper = document.getElementById('subpageWrapper');

    // 1. If returning to Market from anywhere
    if (pageName === 'market') {
      if (this.currentPage !== 'market') {
        this.history.push({ page: this.currentPage, params: {} });
      }
      this.currentPage = 'market';
      this.state.activeTab = 'market';

      if (subpageWrapper) {
        subpageWrapper.innerHTML = '';
        subpageWrapper.style.display = 'none';
        subpageWrapper.classList.remove('active');
      }

      if (marketWrapper) {
        marketWrapper.style.display = 'flex';
        marketWrapper.classList.add('active');
      }

      this.updateBottomDockActive('market');
      this.updateBackButton(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 2. Navigating Forward to a Subpage or other Tab
    // Save current page state in history for backward navigation (الإياب)
    this.history.push({
      page: this.currentPage,
      params,
      scrollY: window.scrollY
    });

    this.currentPage = pageName;
    this.updateBackButton(true);

    // Hide Market and Show Subpage Host
    if (marketWrapper) {
      marketWrapper.style.display = 'none';
      marketWrapper.classList.remove('active');
    }

    if (subpageWrapper) {
      subpageWrapper.style.display = 'flex';
      subpageWrapper.classList.add('active');
      subpageWrapper.innerHTML = `
        <div style="padding: 60px 20px; text-align: center; color: #FFFFFF;">
          <div style="width: 28px; height: 28px; border: 2px solid #333; border-top-color: #FFD200; border-radius: 50%; margin: 0 auto 16px auto; animation: spin 0.8s linear infinite;"></div>
          <p style="font-size: 13px; color: #878E99;">جاري تحميل الصفحة...</p>
        </div>
      `;
    }

    // Fetch and mount subpage content dynamically
    try {
      const response = await fetch(`${pageName}/index.html`);
      if (!response.ok) {
        throw new Error(`تعذر العثور على موديول: ${pageName}`);
      }
      const html = await response.text();

      // Load stylesheet
      this.loadDynamicStylesheet(`${pageName}/style.css`);

      if (subpageWrapper) {
        subpageWrapper.innerHTML = html;
      }

      // Load and execute subpage script
      await this.loadDynamicScript(`${pageName}/script.js`);

      // Initialize subpage controller if defined
      const controllerName = `${pageName.replace(/-([a-z])/g, g => g[1].toUpperCase()).replace(/^./, str => str.toUpperCase())}Module`;
      if (window[controllerName] && typeof window[controllerName].init === 'function') {
        window[controllerName].init({ params });
      }

      this.updateBottomDockActive(pageName);
      window.scrollTo({ top: 0, behavior: 'instant' });

    } catch (err) {
      console.warn(`[App] Error loading ${pageName}:`, err);
      if (subpageWrapper) {
        subpageWrapper.innerHTML = `
          <div style="padding: 60px 24px; text-align: center; color: #FFFFFF;">
            <div style="width: 54px; height: 54px; border-radius: 16px; background: #1C1D21; border: 1px solid #2A2C32; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; color: #FFD200;">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h3 style="font-size: 17px; font-weight: 700; margin-bottom: 6px;">شاشة (${pageName}) قيد التجهيز</h3>
            <p style="font-size: 12px; color: #878E99; margin-bottom: 20px;">جارٍ بناء وربط هذه الشاشة مع الباك إند وفق خطة العمل.</p>
            <button onclick="window.App.goBack()" style="background: #FFD200; color: #121214; font-weight: 700; border: none; padding: 10px 24px; border-radius: 10px; cursor: pointer;">
              الرجوع للسوق
            </button>
          </div>
        `;
      }
    }
  },

  /**
   * Bidirectional Router: Backward Navigation (الإياب والرجوع)
   */
  goBack() {
    console.log('[App] goBack triggered. Current history stack:', this.history);
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.('light');

    if (this.history.length > 0) {
      const previous = this.history.pop();
      if (previous && previous.page) {
        // If returning to market
        if (previous.page === 'market') {
          this.currentPage = 'market';
          this.state.activeTab = 'market';

          const marketWrapper = document.getElementById('marketPageWrapper');
          const subpageWrapper = document.getElementById('subpageWrapper');

          if (subpageWrapper) {
            subpageWrapper.innerHTML = '';
            subpageWrapper.style.display = 'none';
            subpageWrapper.classList.remove('active');
          }

          if (marketWrapper) {
            marketWrapper.style.display = 'flex';
            marketWrapper.classList.add('active');
          }

          this.updateBottomDockActive('market');
          this.updateBackButton(this.history.length > 0);

          if (previous.scrollY !== undefined) {
            window.scrollTo({ top: previous.scrollY, behavior: 'instant' });
          }
          return;
        }

        // Navigate to earlier subpage
        this.navigate(previous.page, previous.params || {});
        return;
      }
    }

    // Default fallback: return to Market
    this.navigate('market');
  },

  /**
   * Toggles native Telegram BackButton
   */
  updateBackButton(show) {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    if (show) {
      tg.BackButton.show();
    } else {
      tg.BackButton.hide();
    }
  },

  /**
   * Coordinates Bottom Dock tab highlight
   */
  updateBottomDockActive(targetTab) {
    document.querySelectorAll('.dock-tab').forEach(tab => {
      const isTarget = tab.dataset.target === targetTab;
      tab.classList.toggle('active', isTarget);
      tab.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });
  },

  /**
   * Global Click Interceptor for Bidirectional Navigation
   */
  bindGlobalNavigation() {
    document.addEventListener('click', (e) => {
      // 1. Forward Navigation Buttons
      const navBtn = e.target.closest('[data-navigate]');
      if (navBtn) {
        e.preventDefault();
        const target = navBtn.dataset.navigate;
        const paramsStr = navBtn.dataset.params;
        let params = {};
        if (paramsStr) {
          try { params = JSON.parse(paramsStr); } catch (_) { }
        }
        this.navigate(target, params);
        return;
      }

      // 2. Backward Navigation Buttons
      const backBtn = e.target.closest('[data-action="back"]');
      if (backBtn) {
        e.preventDefault();
        this.goBack();
        return;
      }
    });
  },

  /**
   * Dynamically loads a stylesheet
   */
  loadDynamicStylesheet(url) {
    let link = document.getElementById('dynamicPageStylesheet');
    if (!link) {
      link = document.createElement('link');
      link.id = 'dynamicPageStylesheet';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = `${url}?v=${Date.now()}`;
  },

  /**
   * Dynamically loads a script
   */
  loadDynamicScript(url) {
    return new Promise((resolve, reject) => {
      const existing = document.getElementById('dynamicPageScript');
      if (existing) existing.remove();

      const script = document.createElement('script');
      script.id = 'dynamicPageScript';
      script.src = `${url}?v=${Date.now()}`;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      document.body.appendChild(script);
    });
  }
};

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
