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

/* ==========================================================================
   Advertise Page (أعلن لدينا) Interactivity
   ========================================================================== */
const channelAdSheet = document.getElementById('channelAdSheet');
const channelAdBackdrop = document.getElementById('channelAdBackdrop');
const channelAdContent = document.getElementById('channelAdContent');
const copyAdTemplateBtn = document.getElementById('copyAdTemplateBtn');

function setChannelAdSheetOpen(open){
  const next = Boolean(open);
  if (channelAdSheet) {
    channelAdSheet.classList.toggle('show', next);
    channelAdSheet.setAttribute('aria-hidden', next ? 'false' : 'true');
  }
  if (channelAdBackdrop) {
    channelAdBackdrop.classList.toggle('show', next);
    channelAdBackdrop.setAttribute('aria-hidden', next ? 'false' : 'true');
  }
  document.body.classList.toggle('channel-ad-open', next);

  if (next && window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
    try { window.Telegram.WebApp.HapticFeedback.selectionChanged(); } catch (_) {}
  }
}

// Open Channel Ad Template Sheet
document.querySelectorAll('[data-action="open-channel-ad-sheet"]').forEach(function(btn){
  btn.addEventListener('click', function(){
    setChannelAdSheetOpen(true);
  });
});

// Close Channel Ad Template Sheet
document.querySelectorAll('[data-action="close-channel-ad-sheet"]').forEach(function(btn){
  btn.addEventListener('click', function(){
    setChannelAdSheetOpen(false);
  });
});

if (channelAdBackdrop) {
  channelAdBackdrop.addEventListener('click', function(){
    setChannelAdSheetOpen(false);
  });
}

document.addEventListener('keydown', function(e){
  if (e.key === 'Escape' && channelAdSheet && channelAdSheet.classList.contains('show')) {
    setChannelAdSheetOpen(false);
  }
});

// Copy Ad Template Button
if (copyAdTemplateBtn && channelAdContent) {
  copyAdTemplateBtn.addEventListener('click', function(){
    const text = channelAdContent.value;
    const btnTextEl = copyAdTemplateBtn.querySelector('.copy-btn-text');
    const originalText = btnTextEl ? btnTextEl.textContent : 'نسخ القالب';

    function onCopySuccess(){
      copyAdTemplateBtn.classList.add('copied');
      if (btnTextEl) btnTextEl.textContent = 'تم النسخ!';
      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
        try { window.Telegram.WebApp.HapticFeedback.notificationOccurred('success'); } catch (_) {}
      }
      setTimeout(function(){
        copyAdTemplateBtn.classList.remove('copied');
        if (btnTextEl) btnTextEl.textContent = originalText;
      }, 2000);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onCopySuccess).catch(function(){
        fallbackCopy();
      });
    } else {
      fallbackCopy();
    }

    function fallbackCopy(){
      try {
        channelAdContent.select();
        document.execCommand('copy');
        onCopySuccess();
      } catch (_) {}
    }
  });
}

// Card 2: أعلن في المتجر (Navigate to add-product)
document.querySelectorAll('[data-action="open-add-product"]').forEach(function(btn){
  btn.addEventListener('click', function(){
    if (window.SouqiRouter && window.SouqiRouter.showRoute) {
      window.SouqiRouter.showRoute('add-product', true);
    }
  });
});

// VIP Subscription buttons (Telegram Stars payment hook placeholder)
document.querySelectorAll('[data-action="vip-buy-stars"]').forEach(function(btn){
  btn.addEventListener('click', function(){
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
      try { window.Telegram.WebApp.HapticFeedback.selectionChanged(); } catch (_) {}
    }
  });
});

/* ==========================================================================
   Support Page (الدعم والشكاوى) Interactivity
   ========================================================================== */
const supportTicketSheet = document.getElementById('supportTicketSheet');
const supportTicketBackdrop = document.getElementById('supportTicketBackdrop');
const supportTicketMessage = document.getElementById('supportTicketMessage');

function setSupportTicketSheetOpen(open){
  const next = Boolean(open);
  if (supportTicketSheet) {
    supportTicketSheet.classList.toggle('show', next);
    supportTicketSheet.setAttribute('aria-hidden', next ? 'false' : 'true');
  }
  if (supportTicketBackdrop) {
    supportTicketBackdrop.classList.toggle('show', next);
    supportTicketBackdrop.setAttribute('aria-hidden', next ? 'false' : 'true');
  }
  document.body.classList.toggle('support-ticket-open', next);

  if (next && window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
    try { window.Telegram.WebApp.HapticFeedback.selectionChanged(); } catch (_) {}
  }
}

// Open Support Ticket Sheet
document.querySelectorAll('[data-action="open-support-ticket-sheet"]').forEach(function(btn){
  btn.addEventListener('click', function(){
    setSupportTicketSheetOpen(true);
  });
});

// Close Support Ticket Sheet
document.querySelectorAll('[data-action="close-support-ticket-sheet"]').forEach(function(btn){
  btn.addEventListener('click', function(){
    setSupportTicketSheetOpen(false);
  });
});

if (supportTicketBackdrop) {
  supportTicketBackdrop.addEventListener('click', function(){
    setSupportTicketSheetOpen(false);
  });
}

document.addEventListener('keydown', function(e){
  if (e.key === 'Escape' && supportTicketSheet && supportTicketSheet.classList.contains('show')) {
    setSupportTicketSheetOpen(false);
  }
});

/* ==========================================================================
   Referral & Earnings (الإحالة والأرباح) Interactivity
   ========================================================================== */
const copyReferralLinkBtn = document.getElementById('copyReferralLinkBtn');
const referralLinkText = document.getElementById('referralLinkText');
const referralToast = document.getElementById('referralToast');
let referralToastTimer = null;

function showReferralToast(){
  if (!referralToast) return;
  referralToast.hidden = false;
  void referralToast.offsetWidth;
  referralToast.classList.add('show');

  if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
    try { window.Telegram.WebApp.HapticFeedback.notificationOccurred('success'); } catch (_) {}
  }

  if (referralToastTimer) clearTimeout(referralToastTimer);
  referralToastTimer = setTimeout(function(){
    referralToast.classList.remove('show');
    setTimeout(function(){
      referralToast.hidden = true;
    }, 250);
  }, 2200);
}

if (copyReferralLinkBtn) {
  copyReferralLinkBtn.addEventListener('click', function(){
    const link = (referralLinkText && referralLinkText.textContent.trim()) || 'https://t.me/SoqyBot?start=ref_REF2CIGOVW';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(showReferralToast).catch(function(){
        fallbackCopy(link);
      });
    } else {
      fallbackCopy(link);
    }
  });
}

function fallbackCopy(text){
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showReferralToast();
  } catch (_) {
    showReferralToast();
  }
}

/* ==========================================================================
   Customer Experiences (تجارب العملاء) Sheet Interactivity
   ========================================================================== */
const experiencesSheet = document.getElementById('experiencesSheet');
const experiencesSheetBackdrop = document.getElementById('experiencesSheetBackdrop');
const reviewExperienceText = document.getElementById('reviewExperienceText');

function setExperiencesSheetOpen(open){
  const next = Boolean(open);
  if (experiencesSheet) {
    experiencesSheet.classList.toggle('show', next);
    experiencesSheet.setAttribute('aria-hidden', next ? 'false' : 'true');
  }
  if (experiencesSheetBackdrop) {
    experiencesSheetBackdrop.classList.toggle('show', next);
    experiencesSheetBackdrop.setAttribute('aria-hidden', next ? 'false' : 'true');
  }
  document.body.classList.toggle('experiences-sheet-open', next);

  if (next && window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
    try { window.Telegram.WebApp.HapticFeedback.selectionChanged(); } catch (_) {}
  }
}

// Open Experiences Sheet
document.querySelectorAll('[data-action="open-experiences-sheet"]').forEach(function(btn){
  btn.addEventListener('click', function(){
    setExperiencesSheetOpen(true);
  });
});

// Close Experiences Sheet
document.querySelectorAll('[data-action="close-experiences-sheet"]').forEach(function(btn){
  btn.addEventListener('click', function(){
    setExperiencesSheetOpen(false);
  });
});

if (experiencesSheetBackdrop) {
  experiencesSheetBackdrop.addEventListener('click', function(){
    setExperiencesSheetOpen(false);
  });
}

// Submit Experience Review
document.querySelectorAll('[data-action="submit-experience"]').forEach(function(btn){
  btn.addEventListener('click', function(){
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
      try { window.Telegram.WebApp.HapticFeedback.notificationOccurred('success'); } catch (_) {}
    }
    if (reviewExperienceText) reviewExperienceText.value = '';
    setExperiencesSheetOpen(false);
  });
});

document.addEventListener('keydown', function(e){
  if (e.key === 'Escape' && experiencesSheet && experiencesSheet.classList.contains('show')) {
    setExperiencesSheetOpen(false);
  }
});

})();


