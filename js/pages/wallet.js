/* Wallet page behavior. Depends only on the shared router contract. */
(function(){
/* wallet */
const walletPage = document.getElementById('walletPage');
const topupBtn = document.getElementById('topupBtn');
const walletAmounts = document.getElementById('walletAmounts');
const walletRefresh = document.getElementById('walletRefresh');

if (topupBtn) {
  topupBtn.addEventListener('click', function(){
    window.SouqiRouter && window.SouqiRouter.showRoute('wallet', true);
  });
}

if (walletAmounts) {
  walletAmounts.addEventListener('click', function(e){
    const btn = e.target.closest('.wallet-star-option');
    if (!btn) return;

    walletAmounts.querySelectorAll('.wallet-star-option').forEach(function(option){
      option.classList.toggle('active', option === btn);
    });

    const price = Number(btn.dataset.amount || 0);
    const stars = Number(btn.dataset.stars || 0);

    window.dispatchEvent(new CustomEvent('souqi:topup-request', {
      detail: { amount: price, stars: stars, source: 'telegram-stars' }
    }));
  });
}

if (walletRefresh) {
  walletRefresh.addEventListener('click', function(){
    walletRefresh.classList.remove('is-refreshing');
    void walletRefresh.offsetWidth;
    walletRefresh.classList.add('is-refreshing');
    window.setTimeout(function(){ walletRefresh.classList.remove('is-refreshing'); }, 420);

    window.dispatchEvent(new CustomEvent('souqi:wallet-refresh'));
  });
}
})();
