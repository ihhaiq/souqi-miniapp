/* frontend-only page routing */
const marketPage = document.getElementById('marketPage');
const ordersPage = document.getElementById('ordersPage');
const addProductPage = document.getElementById('addProductPage');
const escrowPage = document.getElementById('escrowPage');
const accountPage = document.getElementById('accountPage');
const walletPage = document.getElementById('walletPage');
const accountAvatarBtn = document.getElementById('accountAvatarBtn');
const bottomNav = document.getElementById('bottomNav');

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
    bottomNav.querySelectorAll('.nav').forEach(function(btn){
      btn.classList.toggle('active', btn.dataset.route === route);
    });
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

window.SouqiRouter = Object.freeze({
  normalizeRoute: normalizeRoute,
  showRoute: showRoute
});

showRoute(window.location.hash || '#market', false);
