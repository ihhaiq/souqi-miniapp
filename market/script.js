/**
 * Market Screen Module Controller
 * Handles capsule rail drag-to-scroll, active pill animation, filtering, search, and navigation.
 */

window.MarketModule = {
  activeCategory: 'all',
  activeSort: 'popular',
  verifiedOnly: false,
  cartCount: 0,
  searchQuery: '',

  /**
   * Initializes Market View
   */
  init(options = {}) {
    console.log('[MarketModule] Initializing market view...');
    this.bindEvents();
    this.setupRailDragAndScroll();
    this.applyFilters();
  },

  /**
   * Event Bindings
   */
  bindEvents() {
    const tg = window.Telegram?.WebApp;

    // 1. Search Input
    const searchInput = document.getElementById('marketSearchInput');
    const clearBtn = document.getElementById('searchClearBtn');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.trim().toLowerCase();
        if (clearBtn) {
          clearBtn.style.display = this.searchQuery ? 'block' : 'none';
        }
        this.applyFilters();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          this.searchQuery = '';
          clearBtn.style.display = 'none';
          this.applyFilters();
        }
      });
    }

    // 2. Verified-only Toggle Pill
    const verifiedPill = document.getElementById('filterVerifiedPill');
    if (verifiedPill) {
      verifiedPill.addEventListener('click', () => {
        this.verifiedOnly = !this.verifiedOnly;
        verifiedPill.classList.toggle('active', this.verifiedOnly);
        tg?.HapticFeedback?.impactOccurred?.('light');
        this.applyFilters();
      });
    }

    // 3. Bottom Sheets: Filter & Sort Triggers
    const filterOverlay = document.getElementById('filterSheetOverlay');
    const sortOverlay = document.getElementById('sortSheetOverlay');

    document.getElementById('openFilterSheetBtn')?.addEventListener('click', () => {
      filterOverlay?.classList.add('open');
      tg?.HapticFeedback?.impactOccurred?.('light');
    });

    document.getElementById('filterPlatformPill')?.addEventListener('click', () => {
      filterOverlay?.classList.add('open');
    });

    document.getElementById('filterSortPill')?.addEventListener('click', () => {
      sortOverlay?.classList.add('open');
    });

    document.getElementById('closeFilterSheetBtn')?.addEventListener('click', () => {
      filterOverlay?.classList.remove('open');
    });

    document.getElementById('closeSortSheetBtn')?.addEventListener('click', () => {
      sortOverlay?.classList.remove('open');
    });

    filterOverlay?.addEventListener('click', (e) => {
      if (e.target === filterOverlay) filterOverlay.classList.remove('open');
    });

    sortOverlay?.addEventListener('click', (e) => {
      if (e.target === sortOverlay) sortOverlay.classList.remove('open');
    });

    // Apply Filter Button
    document.getElementById('applyFilterFormBtn')?.addEventListener('click', () => {
      filterOverlay?.classList.remove('open');
      tg?.HapticFeedback?.notificationOccurred?.('success');
      this.applyFilters();
    });

    // Reset Filter Button
    document.getElementById('resetFilterFormBtn')?.addEventListener('click', () => {
      this.resetAllFilters();
      filterOverlay?.classList.remove('open');
    });

    document.getElementById('emptyResetBtn')?.addEventListener('click', () => {
      this.resetAllFilters();
    });

    document.getElementById('badgeResetBtn')?.addEventListener('click', () => {
      this.resetAllFilters();
    });

    // Sort Row Selection
    const sortRows = document.querySelectorAll('.sort-option-row');
    sortRows.forEach(row => {
      row.addEventListener('click', () => {
        sortRows.forEach(r => r.classList.remove('active'));
        row.classList.add('active');
        this.activeSort = row.dataset.sort || 'popular';
        
        const sortLabel = document.getElementById('sortFilterLabel');
        if (sortLabel) {
          sortLabel.textContent = row.querySelector('span')?.textContent || 'الترتيب';
        }

        sortOverlay?.classList.remove('open');
        tg?.HapticFeedback?.selectionChanged?.();
        this.applyFilters();
      });
    });

    // 4. Product Cards Clicks & Navigation to Product Details
    const gridContainer = document.getElementById('productsGridContainer');
    if (gridContainer) {
      gridContainer.addEventListener('click', (e) => {
        const cartBtn = e.target.closest('.quick-cart-btn');
        const card = e.target.closest('.product-card');
        
        if (cartBtn) {
          e.stopPropagation();
          this.addToCart();
          return;
        }

        if (card) {
          const productId = card.dataset.productId;
          console.log(`[Market] Navigating to product details: ${productId}`);
          tg?.HapticFeedback?.impactOccurred?.('light');
          if (window.App && typeof window.App.navigate === 'function') {
            window.App.navigate('product-details', { id: productId });
          }
        }
      });
    }

    // Top action buttons (Wallet, News, Menu, Avatar, Balance)
    document.getElementById('topWalletBtn')?.addEventListener('click', () => {
      window.App?.navigate('wallet');
    });

    document.getElementById('topNewsBtn')?.addEventListener('click', () => {
      window.App?.navigate('advertise');
    });

    document.getElementById('topMenuBtn')?.addEventListener('click', () => {
      window.App?.navigate('account');
    });

    document.getElementById('marketAvatarBtn')?.addEventListener('click', () => {
      window.App?.navigate('account');
    });

    document.getElementById('marketBalancePill')?.addEventListener('click', () => {
      window.App?.navigate('wallet');
    });

    document.getElementById('marketCartBtn')?.addEventListener('click', () => {
      window.App?.navigate('cart');
    });

    // 5. Bottom Navigation Dock
    const dockNav = document.getElementById('bottomDockNav');
    if (dockNav) {
      dockNav.addEventListener('click', (e) => {
        const tab = e.target.closest('.dock-tab');
        if (!tab) return;

        const targetPage = tab.dataset.target;
        if (!targetPage) return;

        tg?.HapticFeedback?.impactOccurred?.('light');

        if (targetPage !== 'market' && window.App) {
          window.App.navigate(targetPage);
        }
      });
    }
  },

  /**
   * Sets up drag-to-scroll (mouse + touch) and micro-interactions on the category capsule rail
   */
  setupRailDragAndScroll() {
    const railTrack = document.getElementById('categoryRailTrack');
    if (!railTrack) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let draggedDistance = 0;

    // Mouse drag scrolling
    railTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      draggedDistance = 0;
      railTrack.classList.add('is-dragging');
      startX = e.pageX - railTrack.offsetLeft;
      scrollLeft = railTrack.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      railTrack.classList.remove('is-dragging');
    });

    railTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - railTrack.offsetLeft;
      const walk = (x - startX) * 1.4;
      draggedDistance += Math.abs(x - startX);
      railTrack.scrollLeft = scrollLeft - walk;
    });

    // Click handler with drag discrimination and smooth auto-centering
    railTrack.addEventListener('click', (e) => {
      // If user was dragging, do not activate item
      if (draggedDistance > 6) {
        draggedDistance = 0;
        return;
      }

      const item = e.target.closest('.rail-item');
      if (!item) return;

      railTrack.querySelectorAll('.rail-item').forEach(i => {
        i.classList.remove('active');
        i.setAttribute('aria-selected', 'false');
      });

      item.classList.add('active');
      item.setAttribute('aria-selected', 'true');
      this.activeCategory = item.dataset.category || 'all';

      // Auto-scroll active item into center view
      const trackRect = railTrack.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const scrollOffset = (itemRect.left + itemRect.width / 2) - (trackRect.left + trackRect.width / 2);
      railTrack.scrollBy({ left: scrollOffset, behavior: 'smooth' });

      // Telegram haptic feedback
      window.Telegram?.WebApp?.HapticFeedback?.selectionChanged?.();

      this.applyFilters();
    });
  },

  /**
   * Filters and sorts the visible product cards based on active criteria
   */
  applyFilters() {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.product-card'));
    const emptyState = document.getElementById('marketEmptyState');
    const badge = document.getElementById('activeFilterBadge');
    let visibleCount = 0;

    const hasActiveFilters = this.activeCategory !== 'all' || this.verifiedOnly || !!this.searchQuery;

    cards.forEach(card => {
      const category = card.dataset.category || '';
      const title = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
      const idTag = card.querySelector('.product-id-tag')?.textContent.toLowerCase() || '';
      const isVerified = !!card.querySelector('.verified-badge-icon');

      const matchCategory = (this.activeCategory === 'all') || (category === this.activeCategory);
      const matchSearch = !this.searchQuery || title.includes(this.searchQuery) || idTag.includes(this.searchQuery);
      const matchVerified = !this.verifiedOnly || isVerified;

      if (matchCategory && matchSearch && matchVerified) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Dynamic Client-side Sorting
    if (this.activeSort === 'price_asc' || this.activeSort === 'price_desc') {
      const sortedCards = [...cards].sort((a, b) => {
        const priceA = parseFloat(a.querySelector('.price-amount')?.textContent || '0');
        const priceB = parseFloat(b.querySelector('.price-amount')?.textContent || '0');
        return this.activeSort === 'price_asc' ? priceA - priceB : priceB - priceA;
      });
      sortedCards.forEach(c => grid.appendChild(c));
    }

    // Toggle Empty State
    if (emptyState) {
      emptyState.style.display = (visibleCount === 0) ? 'flex' : 'none';
    }

    // Toggle Active Filter Badge
    if (badge) {
      badge.style.display = hasActiveFilters ? 'inline-flex' : 'none';
      const badgeCount = badge.querySelector('.badge-num');
      if (badgeCount) {
        let count = 0;
        if (this.activeCategory !== 'all') count++;
        if (this.verifiedOnly) count++;
        if (this.searchQuery) count++;
        badgeCount.textContent = count;
      }
    }

    // Update Category Dropdown Pill label
    const platformPill = document.getElementById('filterPlatformPill');
    const platformLabel = document.getElementById('platformFilterLabel');
    if (platformPill && platformLabel) {
      const categoryNames = {
        'all': 'الفئة',
        'social': 'سوشل ميديا',
        'ai-tools': 'ذكاء اصطناعي',
        'streaming': 'بث وترفيه',
        'dev-cloud': 'سحابيات ومطورين',
        'vpn-nitro': 'VPN & Nitro',
        'stars-gifts': 'نجوم وهدايا'
      };
      if (this.activeCategory !== 'all') {
        platformPill.classList.add('active');
        platformLabel.textContent = categoryNames[this.activeCategory] || this.activeCategory;
      } else {
        platformPill.classList.remove('active');
        platformLabel.textContent = 'الفئة';
      }
    }
  },

  /**
   * Resets all filters back to default
   */
  resetAllFilters() {
    this.activeCategory = 'all';
    this.activeSort = 'popular';
    this.verifiedOnly = false;
    this.searchQuery = '';

    const searchInput = document.getElementById('marketSearchInput');
    if (searchInput) searchInput.value = '';

    const clearBtn = document.getElementById('searchClearBtn');
    if (clearBtn) clearBtn.style.display = 'none';

    document.querySelectorAll('.rail-item').forEach(c => {
      const isDefault = c.dataset.category === 'all';
      c.classList.toggle('active', isDefault);
      c.setAttribute('aria-selected', isDefault ? 'true' : 'false');
    });

    document.getElementById('filterVerifiedPill')?.classList.remove('active');
    document.getElementById('filterPlatformPill')?.classList.remove('active');

    const sortLabel = document.getElementById('sortFilterLabel');
    if (sortLabel) sortLabel.textContent = 'الترتيب';

    document.querySelectorAll('.sort-option-row').forEach(r => {
      r.classList.toggle('active', r.dataset.sort === 'popular');
    });

    this.applyFilters();
  },

  /**
   * Handles quick cart increment with Telegram haptic feedback
   */
  addToCart() {
    this.cartCount++;
    const badge = document.getElementById('cartCount');
    if (badge) {
      badge.textContent = this.cartCount;
      badge.style.transform = 'scale(1.3)';
      setTimeout(() => { badge.style.transform = 'scale(1)'; }, 200);
    }
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred?.('success');
  }
};
