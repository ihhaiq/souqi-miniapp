const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
if (tg) {
  try { tg.ready(); } catch(e) {}
  try { tg.expand(); } catch(e) {}
  try { tg.setHeaderColor('#141414'); } catch(e) {}
  try { tg.setBackgroundColor('#141414'); } catch(e) {}
  try { tg.setBottomBarColor('#181818'); } catch(e) {}

  try {
    const telegramUser = tg.initDataUnsafe && tg.initDataUnsafe.user;
    const userAvatar = document.getElementById('userAvatar');
    if (telegramUser && telegramUser.photo_url && userAvatar) {
      userAvatar.src = telegramUser.photo_url;
      userAvatar.alt = telegramUser.first_name ? ('صورة ' + telegramUser.first_name) : 'صورة المستخدم';
    }
  } catch(e) {}
}

const svg = {
  gift:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M7.35 3.1c-2.15 0-3.65 1.34-3.65 3.16 0 1.03.5 1.93 1.4 2.58H3.45A1.45 1.45 0 0 0 2 10.29v2.08c0 .8.65 1.45 1.45 1.45H4v5.63A1.55 1.55 0 0 0 5.55 21h12.9A1.55 1.55 0 0 0 20 19.45v-5.63h.55c.8 0 1.45-.65 1.45-1.45v-2.08c0-.8-.65-1.45-1.45-1.45H18.9c.9-.65 1.4-1.55 1.4-2.58 0-1.82-1.5-3.16-3.65-3.16-2.15 0-3.65 1.48-4.65 3.39-1-1.91-2.5-3.39-4.65-3.39Zm.14 2.17c1.22 0 2.2 1.1 2.92 3.57H7.5c-1.09 0-1.68-.62-1.68-1.47 0-1.08.72-2.1 1.67-2.1Zm9.02 0c.95 0 1.67 1.02 1.67 2.1 0 .85-.59 1.47-1.68 1.47h-2.91c.72-2.47 1.7-3.57 2.92-3.57ZM10.9 11H4.2v.68h6.7V11Zm2.2 0v.68h6.7V11h-6.7Zm-2.2 2.82H6.2v4.98h4.7v-4.98Zm2.2 0v4.98h4.7v-4.98h-4.7Z"/></svg>',
  character:'<svg viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><circle cx="9.2" cy="4.4" r="2.2"/><path d="M7.1 6.1 5.9 10.4 4.2 14.2 6.1 15l1.8-3.4 1.1 2.7-2.1 5.1 2.1.8 2.2-4.7 1.9 4.9 2.1-.8-1.7-5.5-.3-2.6 2.4-2.1h4.9V7.6h-6.2l-2.2 1.7-1.3-2.5-3.7-.7Z"/><rect x="13.7" y="6.4" width="7.1" height="1.2" rx=".5"/><rect x="19.3" y="5.8" width="2.1" height="1" rx=".35"/><path d="M12.2 8.5 16 10l.7-1.3-3.5-1.8-1 1.6Z"/></g></svg>',
  star:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m12 2.7 2.84 5.75 6.35.92-4.59 4.47 1.08 6.32L12 17.18 6.32 20.16l1.08-6.32-4.59-4.47 6.35-.92L12 2.7Z"/></svg>',
  card:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3.1" width="14" height="2.1" rx="1.05" fill="currentColor"/><path fill="currentColor" fill-rule="evenodd" d="M5.4 7h13.2A1.9 1.9 0 0 1 20.5 8.9v6.2a1.9 1.9 0 0 1-1.9 1.9H5.4a1.9 1.9 0 0 1-1.9-1.9V8.9A1.9 1.9 0 0 1 5.4 7Zm6.6 7.5c-.65-.6-3.55-2.35-3.55-4.33 0-1.19.9-2.07 2.07-2.07.7 0 1.3.34 1.48.81.18-.47.78-.81 1.48-.81 1.17 0 2.07.88 2.07 2.07 0 1.98-2.9 3.73-3.55 4.33Z"/><rect x="5" y="18.8" width="14" height="2.1" rx="1.05" fill="currentColor"/></svg>',
  telegram:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M5.4 4.2h13.2A2.4 2.4 0 0 1 21 6.6v8.95a2.4 2.4 0 0 1-2.4 2.4H8.3L4 21v-3.05A2.4 2.4 0 0 1 3 15.55V6.6a2.4 2.4 0 0 1 2.4-2.4Zm2.22 7.06 8.68-3.42c.6-.24 1.06.37.7.88l-3.2 4.58-.2 2.47c-.04.5-.65.69-.97.3l-1.55-1.83-2.58-1.19c-.55-.25-.52-1.03.04-1.25l7.04-2.82-5.66 3.45 2.1.97 1.04 1.18.16-1.77 2.36-3.48-7.33 3.02c-.68.28-1.2-.65-.6-1.03Z"/></svg>',
  wallet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7.5h13.5A1.5 1.5 0 0 1 20 9v8a2 2 0 0 1-2 2H6.5A2.5 2.5 0 0 1 4 16.5V9a1.5 1.5 0 0 1 1-1.42L16.5 4a1 1 0 0 1 1.3.95V7.5"/><circle cx="16.6" cy="13.1" r="1.2"/></svg>',
  megaphone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h4l8-4v8l-8-4H4Z"/><path d="M8 12v5a2 2 0 0 0 2 2h1"/></svg>',
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 7h14M5 12h14M5 17h14"/></svg>',
  cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h2l1.5 9.2a1.5 1.5 0 0 0 1.48 1.25h8.64a1.5 1.5 0 0 0 1.47-1.18L20 8H7.1"/><circle cx="10" cy="19" r="1.2"/><circle cx="17" cy="19" r="1.2"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="5.5"/><path d="M16 16 20 20"/></svg>',
  sliders:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M5 7h14M5 12h14M5 17h14"/><circle cx="9" cy="7" r="1.5" fill="#1c1c1c"/><circle cx="15" cy="12" r="1.5" fill="#1c1c1c"/><circle cx="11" cy="17" r="1.5" fill="#1c1c1c"/></svg>',
  sort:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5v14m0 0-3-3m3 3 3-3M16 19V5m0 0-3 3m3-3 3 3"/></svg>',
  market:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 4.5h7M16.5 13v7"/></svg>',
  orders:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h6"/></svg>',
  gamepad:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 9h8a4 4 0 0 1 3.9 4.7l-.5 2.4a2.4 2.4 0 0 1-3.7 1.4l-2.3-1.5a2.4 2.4 0 0 0-2.8 0l-2.3 1.5a2.4 2.4 0 0 1-3.7-1.4l-.5-2.4A4 4 0 0 1 8 9Z"/><path d="M8 12v4M6 14h4M16.5 13.2h.01M18.5 15.2h.01"/></svg>',
  tasks:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 7h10M9 12h10M9 17h10"/><path d="m4.8 7.2 1.3 1.3 2.1-2.1M4.8 12.2l1.3 1.3 2.1-2.1M4.8 17.2l1.3 1.3 2.1-2.1"/></svg>',
  storage:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="M4.8 7.8 12 12l7.2-4.2M12 12v9"/></svg>',
  board:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="11" rx="2"/><path d="M9 20h6M12 15v5M7.5 8h9M7.5 11h6"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5 8 12l7 7"/></svg>'
};

const assetIcons = {
  gift:'Assets/صورة ChatGPT 1 أكتوبر 2026، 11_01_01 م-1.png',
  character:'Assets/صورة ChatGPT 1 أكتوبر 2026، 11_01_02 م-2.png',
  star:'Assets/صورة ChatGPT 1 أكتوبر 2026، 11_01_04 م-3.png',
  card:'Assets/صورة ChatGPT 1 أكتوبر 2026، 11_01_07 م-4.png',
  telegram:'Assets/صورة ChatGPT 1 أكتوبر 2026، 11_01_08 م-5.png'
};

function mountIcons(root) {
  (root || document).querySelectorAll('[data-icon]').forEach(function(el){
    if (el.innerHTML) return;
    const name = el.dataset.icon;
    if (assetIcons[name]) {
      el.classList.add('uses-asset');
      const img = document.createElement('img');
      img.className = 'asset-icon';
      img.src = assetIcons[name];
      img.alt = '';
      img.draggable = false;
      el.appendChild(img);
      return;
    }
    el.innerHTML = svg[name] || '';
  });
}
mountIcons();

const grid = document.getElementById('grid');
const notice = document.getElementById('notice');
const searchInput = document.getElementById('searchInput');
const marketTitle = document.getElementById('marketTitle');
const marketMeta = document.getElementById('marketMeta');
const sortLabel = document.getElementById('sortLabel');
const featuredPanel = document.getElementById('featuredPanel');
const searchTools = document.getElementById('searchTools');
const marketLine = document.querySelector('.market-line');
const marketFilterStrip = document.getElementById('marketFilterStrip');

let giftItems = [
  {name:'هدية كلاسيكية', id:'#GIFT-1201', price:3.76, type:'gift'},
  {name:'هدية نادرة', id:'#GIFT-1840', price:10.2, type:'nft'},
  {name:'هدية مميزة', id:'#GIFT-2038', price:14.9, type:'gift'},
  {name:'هدية سريعة', id:'#GIFT-2644', price:6.8, type:'gift'},
  {name:'هدية خاصة', id:'#GIFT-2781', price:22.0, type:'nft'},
  {name:'هدية قابلة للتجميع', id:'#GIFT-2910', price:8.4, type:'gift'},
  {name:'هدية عرض', id:'#GIFT-3208', price:12.6, type:'gift'},
  {name:'هدية فاخرة', id:'#GIFT-3492', price:29.1, type:'nft'}
];

let channelItems = [
  {name:'@giftmarket01', id:'قناة تيليجرام', price:10.5, type:'channel'},
  {name:'@souqistars', id:'قناة تيليجرام', price:36.75, type:'channel'},
  {name:'@rarecollections', id:'قناة تيليجرام', price:31.5, type:'channel'},
  {name:'@giftchannelsale', id:'قناة تيليجرام', price:21, type:'channel'},
  {name:'@telegramnftiq', id:'قناة تيليجرام', price:18, type:'channel'},
  {name:'@blockgiftstore', id:'قناة تيليجرام', price:42, type:'channel'},
  {name:'@collectorshub', id:'قناة تيليجرام', price:64, type:'channel'},
  {name:'@marketpromo', id:'قناة تيليجرام', price:27.3, type:'channel'}
];

let avatarItems = giftItems.map(function(item){ return Object.assign({}, item, {type:'character'}); });
let collectibleItems = giftItems.map(function(item){ return Object.assign({}, item, {type:'collectible'}); });

let currentMode = 'gifts';
let sortMode = 0;
let selectedType = 'all';
let selectedPrice = 'all';


function extractItems(payload){
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.items)) return payload.items;
  return null;
}

function normalizeItems(items, fallbackType){
  return (items || []).map(function(item){
    return {
      id: String(item.id || ''),
      name: String(item.name || ''),
      price: Number(item.price || 0),
      type: String(item.type || fallbackType || 'gift')
    };
  }).filter(function(item){
    return item.id && item.name && Number.isFinite(item.price);
  });
}

function setBalance(value){
  const amount = Number(value);
  if (!Number.isFinite(amount)) return;
  const topBalance = document.getElementById('balanceValue');
  const walletBalance = document.getElementById('walletBalanceValue');
  if (topBalance) topBalance.textContent = String(amount);
  if (walletBalance) walletBalance.textContent = String(amount);
}

async function hydrateFromBackend(){
  if (!window.SouqiAPI || window.SouqiAPI.demoMode) return;

  try {
    const results = await Promise.all([
      window.SouqiAPI.getBootstrap(),
      window.SouqiAPI.getCatalog('gifts'),
      window.SouqiAPI.getCatalog('avatars'),
      window.SouqiAPI.getCatalog('collectibles'),
      window.SouqiAPI.getCatalog('channels')
    ]);

    const bootstrap = results[0] || {};
    const gifts = extractItems(results[1]);
    const avatars = extractItems(results[2]);
    const collectibles = extractItems(results[3]);
    const channels = extractItems(results[4]);

    if (bootstrap.balance !== undefined) setBalance(bootstrap.balance);
    if (gifts) giftItems = normalizeItems(gifts, 'gift');
    if (avatars) avatarItems = normalizeItems(avatars, 'character');
    if (collectibles) collectibleItems = normalizeItems(collectibles, 'collectible');
    if (channels) channelItems = normalizeItems(channels, 'channel');

    const note = document.querySelector('.wallet-note');
    if (note) note.textContent = 'سيتم تنفيذ التعبئة عبر الخادم المرتبط بالتطبيق.';
    renderCurrent();
  } catch (error) {
    console.error('[souqi] backend bootstrap failed', error);
  }
}

function findCatalogItem(id, mode){
  const source =
    mode === 'channels' ? channelItems :
    mode === 'avatars' ? avatarItems :
    mode === 'collectibles' ? collectibleItems :
    giftItems;
  return source.find(function(item){ return item.id === id; }) || null;
}

function gemSvg(){
  return '<svg class="balance-gem" viewBox="0 0 24 24" fill="none"><path d="M12 2 3 10l9 12 9-12-9-8Z" fill="#F0C94A"/><path d="M7.5 9 12 2l4.5 7L12 22 7.5 9Z" fill="#DDB633" opacity=".55"/></svg>';
}

function previewMarkup(kind, label){
  return '<div class="preview' + (kind === 'gift' ? ' gift-only' : '') + '">' +
    '<div class="preview-type">' + (kind === 'nft' ? 'NFT' : label) + '</div>' +
    '<span class="banner-icon" data-icon="' + (kind === 'channel' ? 'telegram' : kind === 'character' ? 'character' : kind === 'featured' ? 'star' : kind === 'collectible' ? 'card' : 'gift') + '"></span>' +
    '<div class="preview-title">' + label + '</div>' +
  '</div>';
}

function priceMatch(price){
  if (selectedPrice === 'low') return price < 10;
  if (selectedPrice === 'mid') return price >= 10 && price <= 20;
  if (selectedPrice === 'high') return price > 20;
  return true;
}

function typeMatch(item){
  if (selectedType === 'all') return true;
  if (currentMode === 'channels') return selectedType === 'channel';
  return item.type === selectedType;
}

function sortedFiltered(items){
  const q = searchInput.value.trim().toLowerCase();
  let out = items.filter(function(item){
    const searchable = (item.name + ' ' + item.id).toLowerCase();
    return (!q || searchable.indexOf(q) !== -1) && priceMatch(item.price) && typeMatch(item);
  });
  if (sortMode === 1) out.sort(function(a,b){ return a.price - b.price; });
  if (sortMode === 2) out.sort(function(a,b){ return b.price - a.price; });
  return out;
}

function renderCards(items, visualKind, visualLabel){
  const data = sortedFiltered(items);
  marketMeta.textContent = data.length + (data.length === 1 ? ' عنصر' : ' عناصر');
  if (!data.length) {
    grid.innerHTML = '<div class="empty-state">لا توجد نتائج مطابقة حالياً</div>';
    return;
  }
  grid.innerHTML = data.map(function(item){
    const kind = currentMode === 'channels' ? 'channel' : (visualKind || item.type);
    const label = currentMode === 'channels' ? 'قناة' : (visualLabel || 'هدية');
    return '<article class="card">' +
      previewMarkup(kind, label) +
      '<div class="card-body">' +
        '<div class="item-name">' + item.name + '</div>' +
        '<div class="hash">' + item.id + '</div>' +
        '<button class="price" data-item-id="' + item.id + '" data-item-mode="' + currentMode + '" aria-label="السعر ' + item.price + '">' +
          gemSvg() + '<span class="price-num">' + item.price + '</span>' +
        '</button>' +
      '</div>' +
    '</article>';
  }).join('');
  mountIcons(grid);
}

function renderCurrent(){
  const isFeatured = currentMode === 'featured';
  featuredPanel.hidden = !isFeatured;
  searchTools.classList.toggle('hidden', isFeatured);
  marketFilterStrip.classList.toggle('hidden', isFeatured);
  marketLine.classList.toggle('hidden', isFeatured);
  grid.classList.toggle('hidden', isFeatured);
  notice.classList.toggle('show', currentMode === 'channels' && !isFeatured);

  if (isFeatured) {
    return;
  }

  if (currentMode === 'channels') {
    marketTitle.textContent = 'القنوات المعروضة';
    searchInput.placeholder = 'ابحث باسم القناة';
    renderCards(channelItems, 'channel', 'قناة');
  } else if (currentMode === 'avatars') {
    marketTitle.textContent = 'الشخصيات المعروضة';
    searchInput.placeholder = 'ابحث باسم العنصر أو رقمه';
    renderCards(avatarItems, 'character', 'شخصية');
  } else if (currentMode === 'collectibles') {
    marketTitle.textContent = 'المقتنيات المعروضة';
    searchInput.placeholder = 'ابحث باسم العنصر أو رقمه';
    renderCards(collectibleItems, 'collectible', 'مقتنى');
  } else {
    marketTitle.textContent = 'الهدايا المعروضة';
    searchInput.placeholder = 'ابحث باسم الهدية أو رقمها';
    renderCards(giftItems, null, 'هدية');
  }
}

document.getElementById('tabs').addEventListener('click', function(e){
  const tab = e.target.closest('.tab');
  if (!tab) return;
  document.querySelectorAll('.tab').forEach(function(t){ t.classList.remove('active'); });
  tab.classList.add('active');
  currentMode = tab.dataset.mode || 'gifts';
  searchInput.value = '';
  selectedType = currentMode === 'channels' ? 'channel' : 'all';
  selectedPrice = 'all';
  syncFilterChips();
  renderCurrent();
});

searchInput.addEventListener('input', renderCurrent);

document.querySelectorAll('.market-filter-chip').forEach(function(btn){
  btn.addEventListener('click', function(){
    const kind = btn.dataset.stripFilter;
    if (kind === 'price' || kind === 'symbol' || kind === 'upgrade' || kind === 'premarket') {
      openSheet();
    }
  });
});

document.getElementById('marketStripSort').addEventListener('click', function(){
  document.getElementById('sortBtn').click();
});

document.getElementById('sortBtn').addEventListener('click', function(){
  sortMode = (sortMode + 1) % 3;
  sortLabel.textContent = sortMode === 0 ? 'الأحدث أولاً' : sortMode === 1 ? 'السعر: الأقل أولاً' : 'السعر: الأعلى أولاً';
  this.classList.toggle('active', sortMode !== 0);
  renderCurrent();
});

/* filter sheet */
const sheet = document.getElementById('filterSheet');
const backdrop = document.getElementById('sheetBackdrop');
function openSheet(){
  sheet.classList.add('show');
  backdrop.classList.add('show');
  sheet.setAttribute('aria-hidden','false');
  document.body.classList.add('sheet-open');
}
function closeSheet(){
  sheet.classList.remove('show');
  backdrop.classList.remove('show');
  sheet.setAttribute('aria-hidden','true');
  document.body.classList.remove('sheet-open');
}
document.getElementById('filterBtn').addEventListener('click', openSheet);
document.getElementById('sheetClose').addEventListener('click', closeSheet);
backdrop.addEventListener('click', closeSheet);

sheet.addEventListener('click', function(e){
  const chip = e.target.closest('.filter-chip');
  if (!chip) return;
  const group = chip.dataset.filter;
  sheet.querySelectorAll('.filter-chip[data-filter="' + group + '"]').forEach(function(x){ x.classList.remove('active'); });
  chip.classList.add('active');
  if (group === 'type') selectedType = chip.dataset.value;
  if (group === 'price') selectedPrice = chip.dataset.value;
});

function syncFilterChips(){
  sheet.querySelectorAll('.filter-chip[data-filter="type"]').forEach(function(x){ x.classList.toggle('active', x.dataset.value === selectedType); });
  sheet.querySelectorAll('.filter-chip[data-filter="price"]').forEach(function(x){ x.classList.toggle('active', x.dataset.value === selectedPrice); });
}

document.getElementById('resetFilters').addEventListener('click', function(){
  selectedType = currentMode === 'channels' ? 'channel' : 'all';
  selectedPrice = 'all';
  syncFilterChips();
});

document.getElementById('applyFilters').addEventListener('click', function(){
  document.getElementById('filterBtn').classList.toggle('active', selectedType !== 'all' || selectedPrice !== 'all');
  renderCurrent();
  closeSheet();
});


grid.addEventListener('click', async function(e){
  const button = e.target.closest('.price');
  if (!button) return;

  const item = findCatalogItem(button.dataset.itemId, button.dataset.itemMode || currentMode);
  if (!item) return;

  window.dispatchEvent(new CustomEvent('souqi:purchase-request', {
    detail: { item: item, category: button.dataset.itemMode || currentMode }
  }));

  if (!window.SouqiAPI || window.SouqiAPI.demoMode) {
    const msg = 'طلب شراء تجريبي: ' + item.name + ' — 💎 ' + item.price;
    if (tg && tg.showAlert) tg.showAlert(msg); else alert(msg);
    return;
  }

  button.disabled = true;
  try {
    const result = await window.SouqiAPI.createOrder({
      itemId: item.id,
      category: button.dataset.itemMode || currentMode
    });
    window.dispatchEvent(new CustomEvent('souqi:purchase-created', { detail: result }));
  } catch (error) {
    console.error('[souqi] purchase failed', error);
    if (tg && tg.showAlert) tg.showAlert('تعذر إنشاء الطلب. حاول مرة أخرى.');
  } finally {
    button.disabled = false;
  }
});

/* carousel */
const track = document.getElementById('bannerTrack');
const dotsWrap = document.getElementById('bannerDots');
const slides = Array.from(track.children);
let slideIndex = 0;
let timer = null;
slides.forEach(function(_,i){
  const dot = document.createElement('span');
  dot.className = 'banner-dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', function(){ goSlide(i, true); });
  dotsWrap.appendChild(dot);
});
function goSlide(i,restart){
  slideIndex = (i + slides.length) % slides.length;
  track.style.transform = 'translateX(-' + (slideIndex * 100) + '%)';
  Array.from(dotsWrap.children).forEach(function(d,idx){ d.classList.toggle('active', idx === slideIndex); });
  if (restart) autoSlide();
}
function autoSlide(){
  clearInterval(timer);
  timer = setInterval(function(){ goSlide(slideIndex + 1, false); }, 4400);
}
autoSlide();

let touchX = null;
document.getElementById('bannerCarousel').addEventListener('touchstart', function(e){
  touchX = e.touches[0].clientX;
}, {passive:true});
document.getElementById('bannerCarousel').addEventListener('touchend', function(e){
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 38) goSlide(slideIndex + (dx < 0 ? 1 : -1), true);
  touchX = null;
}, {passive:true});

/* wallet */
const walletPage = document.getElementById('walletPage');
document.getElementById('topupBtn').addEventListener('click', function(){ walletPage.classList.add('show'); });
document.getElementById('walletBack').addEventListener('click', function(){ walletPage.classList.remove('show'); });

let walletAmount = 50;
document.getElementById('walletAmounts').addEventListener('click', function(e){
  const btn = e.target.closest('.wallet-amount');
  if (!btn) return;
  document.querySelectorAll('.wallet-amount').forEach(function(x){ x.classList.remove('active'); });
  btn.classList.add('active');
  walletAmount = Number(btn.dataset.amount);
  document.getElementById('walletCustom').value = '';
});
document.getElementById('walletCustom').addEventListener('input', function(e){
  const v = Number(e.target.value);
  if (v > 0) {
    walletAmount = v;
    document.querySelectorAll('.wallet-amount').forEach(function(x){ x.classList.remove('active'); });
  }
});
document.getElementById('walletContinue').addEventListener('click', async function(){
  const button = this;

  window.dispatchEvent(new CustomEvent('souqi:topup-request', {
    detail: { amount: walletAmount }
  }));

  if (!window.SouqiAPI || window.SouqiAPI.demoMode) {
    const msg = 'تم اختيار تعبئة 💎 ' + walletAmount + ' — هذه معاينة فقط.';
    if (tg && tg.showAlert) tg.showAlert(msg); else alert(msg);
    return;
  }

  button.disabled = true;
  try {
    const result = await window.SouqiAPI.createTopUp({ amount: walletAmount });
    window.dispatchEvent(new CustomEvent('souqi:topup-created', { detail: result }));
  } catch (error) {
    console.error('[souqi] topup failed', error);
    if (tg && tg.showAlert) tg.showAlert('تعذر بدء عملية التعبئة. حاول مرة أخرى.');
  } finally {
    button.disabled = false;
  }
});

document.querySelectorAll('.featured-quick-btn').forEach(function(btn){
  btn.addEventListener('click', function(){
    document.getElementById('featuredAmount').value = btn.dataset.amount || '';
  });
});

document.getElementById('sendToSelfBtn').addEventListener('click', function(){
  const input = document.getElementById('featuredRecipient');
  let username = '';
  if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.username) {
    username = '@' + tg.initDataUnsafe.user.username;
  }
  if (username) {
    input.value = username;
  } else if (tg && tg.showAlert) {
    tg.showAlert('اسم مستخدم تليكرام غير متاح في جلسة المعاينة.');
  }
});

renderCurrent();
hydrateFromBackend();
