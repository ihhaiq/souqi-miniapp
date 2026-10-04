/* Orders page UI only — no backend assumptions. */
(function(){
  "use strict";

  const tabs = Array.from(document.querySelectorAll('.orders-tab'));
  const cards = Array.from(document.querySelectorAll('.order-card'));
  const addButton = document.getElementById('ordersAddButton');

  function setFilter(filter){
    tabs.forEach(function(tab){
      const active = tab.dataset.orderFilter === filter;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    cards.forEach(function(card){
      card.hidden = filter !== 'all' && card.dataset.orderType !== filter;
    });
  }

  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      setFilter(tab.dataset.orderFilter || 'all');
    });
  });

  if (addButton) {
    addButton.addEventListener('click', function(){
      if (window.SouqiRouter) window.SouqiRouter.showRoute('add-product', true);
    });
  }

  setFilter('all');
})();
