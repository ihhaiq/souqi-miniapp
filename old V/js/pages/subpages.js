/* Secondary page interactions (escrow/status controls). */
(function(){
document.querySelectorAll('[data-escrow-action="market"]').forEach(function(btn){
  btn.addEventListener('click', function(){
    window.SouqiRouter && window.SouqiRouter.showRoute('market', true);
  });
});

document.querySelectorAll('[data-escrow-action="history"]').forEach(function(btn){
  btn.addEventListener('click', function(){
    const historySection = document.getElementById('escrowHistory');
    if (!historySection) return;
    historySection.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

document.querySelectorAll('.status-tab').forEach(function(btn){
  btn.addEventListener('click', function(){
    document.querySelectorAll('.status-tab').forEach(function(tab){ tab.classList.remove('active'); });
    btn.classList.add('active');
  });
});
})();
