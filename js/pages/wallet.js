/* Wallet page behavior. Network calls go through SouqiServices.wallet. */
(function(){
  "use strict";

  const topupBtn = document.getElementById('topupBtn');
  const walletAmounts = document.getElementById('walletAmounts');
  const walletRefresh = document.getElementById('walletRefresh');

  if (topupBtn) {
    topupBtn.addEventListener('click', function(){
      window.SouqiRouter && window.SouqiRouter.showRoute('wallet', true);
    });
  }

  if (walletAmounts) {
    walletAmounts.addEventListener('click', async function(e){
      const btn = e.target.closest('.wallet-star-option');
      if (!btn || btn.disabled) return;

      walletAmounts.querySelectorAll('.wallet-star-option').forEach(function(option){
        option.classList.toggle('active', option === btn);
      });

      const payload = {
        amount: Number(btn.dataset.amount || 0),
        stars: Number(btn.dataset.stars || 0),
        source: 'telegram-stars'
      };

      window.dispatchEvent(new CustomEvent('souqi:topup-request', { detail: payload }));

      if (!window.SouqiAPI || window.SouqiAPI.demoMode) return;

      const walletService = window.SouqiServices && window.SouqiServices.wallet;
      btn.disabled = true;
      btn.classList.add('is-loading');

      try {
        const result = walletService
          ? await walletService.topUp(payload)
          : await window.SouqiAPI.createTopUp(payload);
        window.dispatchEvent(new CustomEvent('souqi:topup-created', { detail: result }));
      } catch (error) {
        console.error('[souqi] wallet topup failed', error);
        window.dispatchEvent(new CustomEvent('souqi:topup-error', { detail: error }));
        if (window.SouqiTelegram) {
          window.SouqiTelegram.showAlert('تعذر بدء عملية الشحن. حاول مرة أخرى.');
        }
      } finally {
        btn.disabled = false;
        btn.classList.remove('is-loading');
      }
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
