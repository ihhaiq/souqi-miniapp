/* frontend-only page routing */
const marketPage = document.getElementById('marketPage');
const ordersPage = document.getElementById('ordersPage');
const addProductPage = document.getElementById('addProductPage');
const escrowPage = document.getElementById('escrowPage');
const accountPage = document.getElementById('accountPage');
const favoritesPage = document.getElementById('favoritesPage');
const storagePage = document.getElementById('storagePage');
const walletPage = document.getElementById('walletPage');
const advertisePage = document.getElementById('advertisePage');
const vipPage = document.getElementById('vipPage');
const supportPage = document.getElementById('supportPage');
const guidePage = document.getElementById('guidePage');
const referralPage = document.getElementById('referralPage');
const experiencesPage = document.getElementById('experiencesPage');
const accountAvatarBtn = document.getElementById('accountAvatarBtn');
const bottomNav = document.getElementById('bottomNav');
let currentBottomRoute = null;

function hapticSelection(){
  try {
    const haptic = window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback;
    if (haptic && typeof haptic.selectionChanged === 'function') haptic.selectionChanged();
  } catch (_) {}
}

function normalizeRoute(value){
  const route = String(value || '').replace(/^#/, '');
  if (route === 'orders' || route === 'add-product' || route === 'escrow' || route === 'account' || route === 'storage' || route === 'favorites' || route === 'wallet' || route === 'advertise' || route === 'vip' || route === 'support' || route === 'guide' || route === 'referral' || route === 'experiences' || route === 'market') return route;
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
  if (storagePage) storagePage.hidden = route !== 'storage';
  if (favoritesPage) favoritesPage.hidden = route !== 'favorites';
  if (walletPage) walletPage.hidden = route !== 'wallet';
  if (advertisePage) advertisePage.hidden = route !== 'advertise';
  if (vipPage) vipPage.hidden = route !== 'vip';
  if (supportPage) supportPage.hidden = route !== 'support';
  if (guidePage) guidePage.hidden = route !== 'guide';
  if (referralPage) referralPage.hidden = route !== 'referral';
  if (experiencesPage) experiencesPage.hidden = route !== 'experiences';
  document.body.classList.toggle('subpage-open', !isMarket);
  document.body.classList.toggle('wallet-route', route === 'wallet');
  document.body.classList.toggle('orders-route', route === 'orders');
  document.body.classList.toggle('storage-route', route === 'storage');
  document.body.classList.toggle('favorites-route', route === 'favorites');
  document.body.classList.toggle('advertise-route', route === 'advertise');
  document.body.classList.toggle('vip-route', route === 'vip');
  document.body.classList.toggle('support-route', route === 'support');
  document.body.classList.toggle('guide-route', route === 'guide');
  document.body.classList.toggle('referral-route', route === 'referral');
  document.body.classList.toggle('experiences-route', route === 'experiences');

  if (bottomNav) {
    const previousRoute = currentBottomRoute;
    bottomNav.querySelectorAll('.nav').forEach(function(btn){
      btn.classList.toggle('active', btn.dataset.route === route);
    });
    const changed = previousRoute !== null && previousRoute !== route;
    currentBottomRoute = route;
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

    if (route === 'orders' || route === 'add-product' || route === 'escrow' || route === 'account' || route === 'market') {
      showRoute(route, true);
    }
  });
}

document.querySelectorAll('[data-go-market]').forEach(function(btn){
  btn.addEventListener('click', function(){ showRoute('market', true); });
});

/* Robust global More menu control.
   Kept in router so the hamburger works even if another page script fails. */
function setGlobalMoreMenuOpen(open){
  const menu = document.getElementById('moreMenu');
  const backdrop = document.getElementById('moreMenuBackdrop');
  if (!menu || !backdrop) return;

  const next = Boolean(open);
  menu.classList.toggle('open', next);
  menu.setAttribute('aria-hidden', next ? 'false' : 'true');
  backdrop.hidden = !next;
  document.body.classList.toggle('more-menu-open', next);

  if (next) hapticSelection();
}

document.addEventListener('click', function(e){
  const walletTrigger = e.target.closest('[data-go-wallet]');
  if (walletTrigger && !walletTrigger.closest('#moreMenu .more-menu-row')) {
    e.preventDefault();
    e.stopPropagation();
    setGlobalMoreMenuOpen(false);
    showRoute('wallet', true);
    return;
  }

  const trigger = e.target.closest('[data-more-menu-trigger]');
  if (trigger) {
    e.preventDefault();
    e.stopPropagation();
    setGlobalMoreMenuOpen(true);
    return;
  }

  if (e.target.closest('#moreMenuClose') || e.target.id === 'moreMenuBackdrop') {
    e.preventDefault();
    setGlobalMoreMenuOpen(false);
    return;
  }

  const row = e.target.closest('#moreMenu .more-menu-row');
  if (row) {
    if (row.hasAttribute('data-go-wallet')) {
      showRoute('wallet', true);
    } else if (row.dataset.action === 'manage-listings') {
      showRoute('storage', true);
    } else if (row.dataset.action === 'open-favorites') {
      showRoute('favorites', true);
    } else if (row.dataset.action === 'open-advertise' || row.dataset.action === 'advertise-with-us') {
      showRoute('advertise', true);
    } else if (row.dataset.action === 'open-vip' || row.dataset.action === 'vip-membership') {
      showRoute('vip', true);
    } else if (row.dataset.action === 'open-support' || row.dataset.action === 'customer-support' || row.dataset.action === 'support') {
      showRoute('support', true);
    } else if (row.dataset.action === 'open-guide' || row.dataset.action === 'usage-guide' || row.dataset.action === 'guide') {
      showRoute('guide', true);
    } else if (row.dataset.action === 'open-referral' || row.dataset.action === 'referrals' || row.dataset.action === 'referral') {
      showRoute('referral', true);
    } else if (row.dataset.action === 'open-experiences' || row.dataset.action === 'customer-experiences' || row.dataset.action === 'experiences') {
      showRoute('experiences', true);
    }
    setGlobalMoreMenuOpen(false);
  }
}, true);

document.addEventListener('keydown', function(e){
  if (e.key === 'Escape') setGlobalMoreMenuOpen(false);
});



document.querySelectorAll('[data-action="open-favorites"]').forEach(function(btn){
  btn.addEventListener('click', function(){ showRoute('favorites', true); });
});

document.querySelectorAll('[data-action="manage-listings"]').forEach(function(btn){
  btn.addEventListener('click', function(){ showRoute('storage', true); });
});

document.querySelectorAll('[data-action="open-advertise"]').forEach(function(btn){
  btn.addEventListener('click', function(){ showRoute('advertise', true); });
});

document.querySelectorAll('[data-action="open-vip"]').forEach(function(btn){
  btn.addEventListener('click', function(){ showRoute('vip', true); });
});

document.querySelectorAll('[data-action="open-support"]').forEach(function(btn){
  btn.addEventListener('click', function(){ showRoute('support', true); });
});

document.querySelectorAll('[data-action="open-guide"]').forEach(function(btn){
  btn.addEventListener('click', function(){ showRoute('guide', true); });
});

document.querySelectorAll('[data-action="open-referral"]').forEach(function(btn){
  btn.addEventListener('click', function(){ showRoute('referral', true); });
});

document.querySelectorAll('[data-action="open-experiences"]').forEach(function(btn){
  btn.addEventListener('click', function(){ showRoute('experiences', true); });
});

document.querySelectorAll('[data-go-account]').forEach(function(btn){
  btn.addEventListener('click', function(){ showRoute('account', true); });
});

window.addEventListener('hashchange', function(){
  showRoute(window.location.hash, false);
});


window.SouqiRouter = Object.freeze({
  normalizeRoute: normalizeRoute,
  showRoute: showRoute
});

showRoute(window.location.hash || '#market', false);
