/* frontend-only page routing */
const marketPage = document.getElementById('marketPage');
const ordersPage = document.getElementById('ordersPage');
const addProductPage = document.getElementById('addProductPage');
const escrowPage = document.getElementById('escrowPage');
const accountPage = document.getElementById('accountPage');
const walletPage = document.getElementById('walletPage');
const accountAvatarBtn = document.getElementById('accountAvatarBtn');
const bottomNav = document.getElementById('bottomNav');
const liquidNavIndicator = document.getElementById('liquidNavIndicator');
let liquidNavTimer = 0;
let currentBottomRoute = null;

function hapticSelection(){
  try {
    const haptic = window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback;
    if (haptic && typeof haptic.selectionChanged === 'function') haptic.selectionChanged();
  } catch (_) {}
}

function positionLiquidIndicator(activeBtn, animate){
  if (!bottomNav || !liquidNavIndicator || !activeBtn) return;
  const navRect = bottomNav.getBoundingClientRect();
  const btnRect = activeBtn.getBoundingClientRect();
  const inset = 3;
  const x = btnRect.left - navRect.left + inset;
  const y = btnRect.top - navRect.top + inset;
  const width = Math.max(0, btnRect.width - inset * 2);
  const height = Math.max(0, btnRect.height - inset * 2);

  if (!animate) bottomNav.classList.add('nav-no-motion');
  liquidNavIndicator.style.width = width + 'px';
  liquidNavIndicator.style.height = height + 'px';
  liquidNavIndicator.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) scaleX(' + (animate ? '1.08' : '1') + ')';

  if (animate) {
    liquidNavIndicator.classList.add('is-stretching');
    cancelAnimationFrame(liquidNavIndicator._settleFrame || 0);
    liquidNavIndicator._settleFrame = requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        liquidNavIndicator.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) scaleX(1)';
      });
    });
    clearTimeout(liquidNavTimer);
    liquidNavTimer = setTimeout(function(){
      liquidNavIndicator.classList.remove('is-stretching');
    }, 470);
  } else {
    requestAnimationFrame(function(){ bottomNav.classList.remove('nav-no-motion'); });
  }
}

function syncLiquidIndicator(animate){
  if (!bottomNav) return;
  const activeBtn = bottomNav.querySelector('.nav.active');
  positionLiquidIndicator(activeBtn, !!animate);
}

function normalizeRoute(value){
  const route = String(value || '').replace(/^#/, '');
  if (route === 'orders' || route === 'add-product' || route === 'escrow' || route === 'account' || route === 'wallet' || route === 'market') return route;
  return 'market';
}

function showRoute(route, updateHash){
  route = normalizeRoute(route);
  const isMarket = route === 'market';

  if (marketPage) marketPage.hidden = !isMarket;
  if (ordersPage) ordersPage.hidden = route !== 'orders';
  if (addProductPage) addProductPage.hidden = route !== 'add-product';
  if (escrowPage) escrowPage.hidden = route !== 'escrow';
  if (accountPage) accountPage.hidden = route !== 'account';
  if (walletPage) walletPage.hidden = route !== 'wallet';
  document.body.classList.toggle('subpage-open', !isMarket);
  document.body.classList.toggle('wallet-route', route === 'wallet');
  document.body.classList.toggle('orders-route', route === 'orders');

  if (bottomNav) {
    const previousRoute = currentBottomRoute;
    bottomNav.querySelectorAll('.nav').forEach(function(btn){
      btn.classList.toggle('active', btn.dataset.route === route);
    });
    const changed = previousRoute !== null && previousRoute !== route;
    currentBottomRoute = route;
    syncLiquidIndicator(changed);
    if (changed) hapticSelection();
  }

  if (updateHash && window.location.hash !== '#' + route) {
    history.replaceState(null, '', '#' + route);
  }

  window.scrollTo({top:0, behavior:'auto'});
  if (window.SouqiUI && window.SouqiUI.mountIcons) window.SouqiUI.mountIcons(document);
}

if (accountAvatarBtn) {
  accountAvatarBtn.addEventListener('click', function(){
    showRoute('account', true);
  });
}

if (bottomNav) {
  bottomNav.addEventListener('pointerdown', function(e){
    const btn = e.target.closest('.nav');
    if (btn) btn.classList.add('is-pressed');
  });
  ['pointerup','pointercancel','pointerleave'].forEach(function(type){
    bottomNav.addEventListener(type, function(){
      bottomNav.querySelectorAll('.nav.is-pressed').forEach(function(btn){ btn.classList.remove('is-pressed'); });
    });
  });

  bottomNav.addEventListener('click', function(e){
    const btn = e.target.closest('.nav');
    if (!btn) return;
    const route = btn.dataset.route;

    if (route === 'orders' || route === 'add-product' || route === 'escrow' || route === 'market') {
      showRoute(route, true);
    }
    // "المخزن" يبقى قابلًا للضغط بصريًا فقط في هذه المرحلة.
  });
}

document.querySelectorAll('[data-go-market]').forEach(function(btn){
  btn.addEventListener('click', function(){ showRoute('market', true); });
});

document.querySelectorAll('[data-go-wallet]').forEach(function(btn){
  btn.addEventListener('click', function(){ showRoute('wallet', true); });
});

window.addEventListener('hashchange', function(){
  showRoute(window.location.hash, false);
});

window.addEventListener('resize', function(){
  syncLiquidIndicator(false);
});

window.SouqiRouter = Object.freeze({
  normalizeRoute: normalizeRoute,
  showRoute: showRoute
});

showRoute(window.location.hash || '#market', false);
