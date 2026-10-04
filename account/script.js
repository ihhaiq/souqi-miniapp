/**
 * SOUQI — ACCOUNT SCREEN MODULE CONTROLLER (حسابي)
 * Coordinates user profile synchronization, edit name drawer, theme toggle, and subpage routing.
 */

window.AccountModule = {
  userName: 'مستخدم سوقي',
  userId: '1467',
  theme: 'dark',
  walletBalance: 0.00,
  activeListingsCount: 0,
  completedDealsCount: 0,
  rating: 0.00,

  /**
   * Initializes Account View
   */
  init(options = {}) {
    console.log('[AccountModule] Initializing account module...', options);
    this.syncUserData();
    this.bindEvents();
    this.syncThemeState();
  },

  /**
   * Synchronizes Profile Data with Telegram WebApp SDK or Local State
   */
  syncUserData() {
    const tg = window.Telegram?.WebApp;
    const tgUser = tg?.initDataUnsafe?.user;

    // 1. Resolve Display Name
    const savedCustomName = localStorage.getItem('souqi_user_custom_name');
    if (savedCustomName) {
      this.userName = savedCustomName;
    } else if (tgUser) {
      const full = [tgUser.first_name, tgUser.last_name].filter(Boolean).join(' ');
      this.userName = full || tgUser.username || 'مستخدم سوقي';
    } else if (window.App?.state?.user?.name) {
      this.userName = window.App.state.user.name;
    }

    // 2. Resolve User ID / Username
    if (tgUser?.id) {
      this.userId = tgUser.username ? `@${tgUser.username}` : `#${tgUser.id}`;
    } else if (window.App?.state?.user?.id) {
      this.userId = window.App.state.user.username || `#${window.App.state.user.id}`;
    }

    // 3. Resolve Avatar
    const avatarImg = document.getElementById('accountProfileAvatar');
    const avatarFallback = document.getElementById('accountProfileFallback');

    if (tgUser?.photo_url && avatarImg && avatarFallback) {
      avatarImg.src = tgUser.photo_url;
      avatarImg.style.display = 'block';
      avatarFallback.style.display = 'none';
    } else if (avatarFallback) {
      avatarFallback.textContent = (this.userName.trim().charAt(0) || 'M').toUpperCase();
    }

    // 4. Update DOM Elements
    const nameEl = document.getElementById('accountProfileName');
    const idEl = document.getElementById('accountProfileId');
    const balanceEl = document.getElementById('accountWalletBalance');
    const headerBalanceEl = document.getElementById('accountHeaderBalanceVal');

    if (nameEl) nameEl.textContent = this.userName;
    if (idEl) idEl.textContent = this.userId;
    if (balanceEl) balanceEl.textContent = this.walletBalance.toFixed(2);
    if (headerBalanceEl) headerBalanceEl.textContent = `$${this.walletBalance.toFixed(2)}`;
  },

  /**
   * Syncs Theme UI with current active theme
   */
  syncThemeState() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('souqi_theme') || 'dark';
    this.theme = currentTheme;
    this.updateThemeUI(currentTheme);
  },

  updateThemeUI(theme) {
    const tag = document.getElementById('themeStatusTag');
    const sub = document.getElementById('themeStatusSub');
    const icon = document.getElementById('themeToggleIcon');

    if (tag) {
      tag.textContent = (theme === 'light') ? 'أبيض حليبي' : 'داكن';
    }
    if (sub) {
      sub.textContent = (theme === 'light') ? 'التبديل إلى الوضع الداكن' : 'التبديل إلى أبيض حليبي';
    }
    if (icon) {
      if (theme === 'light') {
        // Sun SVG
        icon.innerHTML = '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>';
      } else {
        // Moon SVG
        icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
      }
    }
  },

  /**
   * Event Bindings
   */
  bindEvents() {
    const tg = window.Telegram?.WebApp;

    // 1. Back Button
    const backBtn = document.getElementById('accountBackBtn');
    if (backBtn) {
      backBtn.onclick = () => {
        tg?.HapticFeedback?.impactOccurred?.('light');
        if (window.App && typeof window.App.goBack === 'function') {
          window.App.goBack();
        } else if (window.App && typeof window.App.navigate === 'function') {
          window.App.navigate('market');
        }
      };
    }

    // 2. Navigation Elements (Cards, Quick Links, Menu Rows)
    const navTriggers = document.querySelectorAll('.account-view [data-action="navigate"]');
    navTriggers.forEach(el => {
      el.onclick = (e) => {
        e.stopPropagation();
        const target = el.dataset.target;
        if (!target) return;

        console.log(`[Account] Navigating to: ${target}`);
        tg?.HapticFeedback?.impactOccurred?.('light');
        window.App?.navigate?.(target);
      };
    });

    // 3. Menu Hamburger Button
    const menuBtn = document.getElementById('accountMenuBtn');
    if (menuBtn) {
      menuBtn.onclick = () => {
        tg?.HapticFeedback?.impactOccurred?.('light');
        const termsSheet = document.getElementById('termsSheetOverlay');
        termsSheet?.classList.add('open');
      };
    }

    // 4. Edit Name Bottom Sheet Modal
    const editSheet = document.getElementById('editNameSheetOverlay');
    const openEditBtn = document.getElementById('openEditNameBtn');
    const closeEditBtn = document.getElementById('closeEditNameSheetBtn');
    const cancelEditBtn = document.getElementById('cancelEditNameBtn');
    const saveEditBtn = document.getElementById('saveEditNameBtn');
    const nameInput = document.getElementById('customProfileNameInput');

    const openEditModal = () => {
      if (nameInput) nameInput.value = this.userName;
      editSheet?.classList.add('open');
      tg?.HapticFeedback?.impactOccurred?.('light');
      setTimeout(() => nameInput?.focus(), 250);
    };

    const closeEditModal = () => {
      editSheet?.classList.remove('open');
    };

    if (openEditBtn) openEditBtn.onclick = openEditModal;
    if (closeEditBtn) closeEditBtn.onclick = closeEditModal;
    if (cancelEditBtn) cancelEditBtn.onclick = closeEditModal;

    if (editSheet) {
      editSheet.onclick = (e) => {
        if (e.target === editSheet) closeEditModal();
      };
    }

    if (saveEditBtn) {
      saveEditBtn.onclick = () => {
        const newName = nameInput?.value.trim();
        if (!newName) {
          tg?.HapticFeedback?.notificationOccurred?.('error');
          return;
        }

        this.userName = newName;
        localStorage.setItem('souqi_user_custom_name', newName);

        const nameEl = document.getElementById('accountProfileName');
        if (nameEl) nameEl.textContent = newName;

        const fallback = document.getElementById('accountProfileFallback');
        if (fallback) fallback.textContent = newName.charAt(0).toUpperCase();

        closeEditModal();
        tg?.HapticFeedback?.notificationOccurred?.('success');
      };
    }

    // 5. Terms & Policies Bottom Sheet Modal
    const termsSheet = document.getElementById('termsSheetOverlay');
    const openTermsBtn = document.getElementById('openTermsSheetBtn');
    const closeTermsBtn = document.getElementById('closeTermsSheetBtn');
    const acceptTermsBtn = document.getElementById('acceptTermsBtn');

    const openTerms = () => {
      termsSheet?.classList.add('open');
      tg?.HapticFeedback?.impactOccurred?.('light');
    };

    const closeTerms = () => {
      termsSheet?.classList.remove('open');
    };

    if (openTermsBtn) openTermsBtn.onclick = openTerms;
    if (closeTermsBtn) closeTermsBtn.onclick = closeTerms;
    if (acceptTermsBtn) acceptTermsBtn.onclick = closeTerms;

    if (termsSheet) {
      termsSheet.onclick = (e) => {
        if (e.target === termsSheet) closeTerms();
      };
    }

    // 6. Theme Toggle (التبديل بين داكن و أبيض حليبي)
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.onclick = () => {
        if (window.App && typeof window.App.toggleTheme === 'function') {
          const newTheme = window.App.toggleTheme();
          this.theme = newTheme;
          this.updateThemeUI(newTheme);
        } else {
          this.theme = (this.theme === 'dark') ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', this.theme);
          localStorage.setItem('souqi_theme', this.theme);
          this.updateThemeUI(this.theme);
        }
      };
    }

    // 7. Bottom Dock Navigation
    const dockNav = document.getElementById('accountBottomDock');
    if (dockNav) {
      dockNav.onclick = (e) => {
        const tab = e.target.closest('.dock-tab');
        if (!tab) return;

        const targetPage = tab.dataset.target;
        if (!targetPage) return;

        tg?.HapticFeedback?.impactOccurred?.('light');

        if (targetPage !== 'account' && window.App) {
          window.App.navigate(targetPage);
        }
      };
    }
  }
};
