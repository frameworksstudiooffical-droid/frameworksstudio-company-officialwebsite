/**
 * Frameworks Studio — Agency Core Engine
 * Live API Integration, Cloudflare Turnstile CAPTCHA, WhatsApp Routing & Luxury UI
 */

// Global Turnstile Token Store & Callback
window.turnstileToken = "";
window.onTurnstileSuccess = function(token) {
  window.turnstileToken = token;
  const notice = document.getElementById('formNotice');
  if (notice && notice.textContent.includes('CAPTCHA')) {
    notice.classList.add('hidden');
  }
};

window.onTurnstileExpired = function() {
  window.turnstileToken = "";
};

window.onTurnstileError = function() {
  window.turnstileToken = "";
  console.warn("Cloudflare Turnstile failed to load or encountered an error.");
};

// Immediate theme initialization to prevent flash of wrong theme
(function () {
  const savedTheme = localStorage.getItem('frameworks_theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    document.documentElement.classList.add('dark');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  initNavScroll();
  initMobileMenu();
  initPlanSelectors();
  initPortfolioModal();
  initPortfolioFilters();
  initContactForm();
  initSpotlightFX();
  initYear();
});

// 0. Theme Engine (Dark & White Themes)
function initTheme() {
  const toggleButtons = document.querySelectorAll('[data-theme-toggle]');

  function updateIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.theme-icon-sun').forEach(el => {
      el.classList.toggle('hidden', !isDark);
      el.classList.toggle('block', isDark);
    });
    document.querySelectorAll('.theme-icon-moon').forEach(el => {
      el.classList.toggle('hidden', isDark);
      el.classList.toggle('block', !isDark);
    });
    document.querySelectorAll('.theme-text-label').forEach(el => {
      el.textContent = isDark ? 'Light Theme' : 'Dark Theme';
    });
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  updateIcons();

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('frameworks_theme', isDark ? 'dark' : 'light');
      updateIcons();
    });
  });
}

// 1. Navigation Scroll Effect
function initNavScroll() {
  const navbar = document.getElementById('mainNav');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('shadow-xl', 'border-indigo-500/20');
      navbar.classList.remove('border-slate-200', 'dark:border-white/5');
    } else {
      navbar.classList.remove('shadow-xl', 'border-indigo-500/20');
      navbar.classList.add('border-slate-200', 'dark:border-white/5');
    }
  });
}

// 2. Mobile Menu Toggle
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const navHeader = document.getElementById('mainNav');
  if (!toggleBtn || !mobileMenu) return;

  function setMenuState(open) {
    if (open) {
      mobileMenu.classList.remove('hidden');
      toggleBtn.innerHTML = '<i data-lucide="x" class="w-5 h-5"></i>';
    } else {
      mobileMenu.classList.add('hidden');
      toggleBtn.innerHTML = '<i data-lucide="menu" class="w-5 h-5"></i>';
    }
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isClosed = mobileMenu.classList.contains('hidden');
    setMenuState(isClosed);
  });

  const links = mobileMenu.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      setMenuState(false);
    });
  });

  // Close when tapping outside the navigation bar
  document.addEventListener('click', (e) => {
    if (!mobileMenu.classList.contains('hidden')) {
      if (!navHeader || !navHeader.contains(e.target)) {
        setMenuState(false);
      }
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      setMenuState(false);
    }
  });
}

// 3. Plan Auto-Selection & Smooth Scroll to Contact
function initPlanSelectors() {
  const planButtons = document.querySelectorAll('[data-select-plan]');
  const planSelectInput = document.getElementById('projectPlan');
  const contactCard = document.getElementById('contactCard');

  planButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const planName = button.getAttribute('data-select-plan');
      
      if (planSelectInput) {
        planSelectInput.value = planName;
      }

      // Smooth scroll to contact section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }

      // Visual flash highlight on contact card
      if (contactCard) {
        contactCard.classList.add('ring-2', 'ring-indigo-500', 'ring-offset-4', 'ring-offset-slate-100', 'dark:ring-offset-[#06080F]');
        setTimeout(() => {
          contactCard.classList.remove('ring-2', 'ring-indigo-500', 'ring-offset-4', 'ring-offset-slate-100', 'dark:ring-offset-[#06080F]');
        }, 2200);
      }
    });
  });
}

// 4. Live Portfolio Preview Modal (Interactive Iframe with Device Switcher)
function initPortfolioModal() {
  const modal = document.getElementById('previewModal');
  const modalFrame = document.getElementById('previewIframe');
  const modalTitle = document.getElementById('previewTitle');
  const modalUrl = document.getElementById('previewUrl');
  const modalExternalBtn = document.getElementById('previewExternalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const deviceButtons = document.querySelectorAll('[data-device-width]');
  const frameContainer = document.getElementById('frameContainer');

  if (!modal || !modalFrame) return;

  const openButtons = document.querySelectorAll('[data-preview-url]');
  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = btn.getAttribute('data-preview-url');
      const displayUrl = btn.getAttribute('data-display-url') || url;
      const title = btn.getAttribute('data-preview-title') || 'Live Client Demo';

      modalTitle.textContent = title;
      modalUrl.textContent = displayUrl;
      modalExternalBtn.href = url;
      modalFrame.src = url;

      if (frameContainer) {
        frameContainer.style.maxWidth = '100%';
      }
      deviceButtons.forEach(dBtn => dBtn.classList.remove('bg-indigo-600', 'text-white'));
      const defaultDesktopBtn = document.querySelector('[data-device-width="100%"]');
      if (defaultDesktopBtn) defaultDesktopBtn.classList.add('bg-indigo-600', 'text-white');

      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    modalFrame.src = 'about:blank';
    document.body.style.overflow = 'auto';
  };

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  deviceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const width = btn.getAttribute('data-device-width');
      if (frameContainer) {
        frameContainer.style.maxWidth = width;
      }
      deviceButtons.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white');
        b.classList.add('text-slate-500', 'dark:text-slate-400');
      });
      btn.classList.add('bg-indigo-600', 'text-white');
      btn.classList.remove('text-slate-500', 'dark:text-slate-400');
    });
  });
}

// 5. Portfolio Filtering
function initPortfolioFilters() {
  const filterButtons = document.querySelectorAll('[data-filter]');
  const portfolioItems = document.querySelectorAll('[data-category]');

  if (!filterButtons.length) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-500');
        b.classList.add('bg-slate-200/60', 'dark:bg-white/5', 'text-slate-600', 'dark:text-slate-400', 'border-slate-300', 'dark:border-white/10');
      });
      btn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-500');
      btn.classList.remove('bg-slate-200/60', 'dark:bg-white/5', 'text-slate-600', 'dark:text-slate-400', 'border-slate-300', 'dark:border-white/10');

      portfolioItems.forEach(item => {
        const categories = item.getAttribute('data-category').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// 6. Interactive Spotlight Follow Effect (Desktop Mouse & Mobile Touch)
function initSpotlightFX() {
  const spotlightElements = document.querySelectorAll('.spotlight-card');
  spotlightElements.forEach(el => {
    function updateCoords(clientX, clientY) {
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);
    }

    el.addEventListener('mousemove', (e) => {
      updateCoords(e.clientX, e.clientY);
    });

    el.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        updateCoords(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    el.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        updateCoords(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  });
}

// 7. Contact Form API Processing with Live Backend & Cloudflare Turnstile
function initContactForm() {
  const form = document.getElementById('agencyContactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('submitBtnText');
  const btnSpinner = document.getElementById('submitBtnSpinner');
  const formNotice = document.getElementById('formNotice');

  if (!form) return;

  // Read config from window.ENV or fallback to shielded internal endpoint
  const config = window.ENV || {
    CONTACT_ENDPOINT: "/api/contact",
    WHATSAPP_NUMBER: "916383976149"
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('clientName')?.value.trim();
    const company = document.getElementById('clientCompany')?.value.trim();
    const email = document.getElementById('clientEmail')?.value.trim();
    const phone = document.getElementById('clientPhone')?.value.trim();
    const plan = document.getElementById('projectPlan')?.value;
    const timeline = document.getElementById('projectTimeline')?.value;
    const message = document.getElementById('projectMessage')?.value.trim();
    const botField = document.getElementById('bot_field')?.value.trim();

    // 1. Client-Side Input Validations
    if (!name || name.length < 2 || name.length > 80) {
      showFormNotice('Please enter your full name (2 — 80 characters).', 'error');
      return;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormNotice('Please enter a valid work email address.', 'error');
      return;
    }

    if (!message || message.length < 10) {
      showFormNotice('Please provide a brief message / overview (at least 10 characters).', 'error');
      return;
    }

    // 2. Cloudflare Turnstile Verification Check
    if (!window.turnstileToken) {
      showFormNotice('Please complete the Cloudflare security verification check below.', 'warning');
      return;
    }

    // 3. Construct Strict API Payload (Strict Schema: extra="forbid")
    const payload = {
      name: name.replace(/[\r\n]/g, ' '),
      email: email,
      phone: phone ? phone.substring(0, 30) : null,
      company: company ? company.substring(0, 100) : null,
      business_type: plan ? plan.substring(0, 100) : null,
      timeline: timeline ? timeline.substring(0, 100) : null,
      message: message,
      bot_field: botField || null,
      "cf-turnstile-response": window.turnstileToken
    };

    // Construct WhatsApp Link for confirmation or fallback
    const waText = encodeURIComponent(
      `*New Project Inquiry — Frameworks Studio*\n\n` +
      `👤 *Name:* ${name}\n` +
      `🏢 *Company:* ${company || 'N/A'}\n` +
      `📧 *Email:* ${email}\n` +
      `📞 *Phone:* ${phone || 'N/A'}\n` +
      `💼 *Plan / Scope:* ${plan}\n` +
      `⚡ *Timeline:* ${timeline}\n\n` +
      `📝 *Message / Brief:*\n${message}`
    );
    const waLink = `https://wa.me/${config.WHATSAPP_NUMBER}?text=${waText}`;

    // Set Loading State
    if (submitBtn) submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Transmitting to Frameworks API...';
    if (btnSpinner) btnSpinner.classList.remove('hidden');
    if (formNotice) formNotice.classList.add('hidden');

    try {
      const response = await fetch(config.CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        // 200 OK — Success
        showFormSuccess(name, waLink, data?.message || 'Your project specifications have been delivered to our engineering team!');
        form.reset();
        
        // Reset Cloudflare Turnstile
        if (window.turnstile) {
          try { window.turnstile.reset(); } catch(e){}
        }
        window.turnstileToken = "";
      } else if (response.status === 400) {
        // 400 Bad Request — CAPTCHA verification failed
        showFormNotice(data?.message || 'CAPTCHA security verification failed. Please try verifying again.', 'error');
        if (window.turnstile) {
          try { window.turnstile.reset(); } catch(e){}
        }
        window.turnstileToken = "";
      } else if (response.status === 422) {
        // 422 Unprocessable Entity — Validation Error
        let errorMsg = data?.message || 'Validation failed.';
        if (Array.isArray(data?.errors) && data.errors.length > 0) {
          errorMsg = data.errors.map(err => `${err.field}: ${err.message}`).join(', ');
        }
        showFormNotice(`Validation notice: ${errorMsg}`, 'error');
      } else if (response.status === 429) {
        // 429 Rate Limit
        const retryAfter = response.headers.get('Retry-After') || 'a few';
        showFormNotice(`Rate limit reached (max 5 submissions per 10 mins). Please wait ${retryAfter} seconds before trying again.`, 'warning');
      } else {
        // Generic API Error
        showFormNotice(data?.message || 'Failed to submit inquiry to the server. Please try again.', 'error');
      }
    } catch (networkError) {
      console.error('Contact Form Network Error:', networkError);
      // Seamless WhatsApp Fallback so no lead is lost!
      showFormNotice(
        `Unable to reach API server. <a href="${waLink}" target="_blank" class="underline font-bold hover:text-white">Click here to send your inquiry directly via WhatsApp (+91 6383976149)</a>.`,
        'warning'
      );
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Submit Project Scope';
      if (btnSpinner) btnSpinner.classList.add('hidden');
    }
  });

  function showFormNotice(msg, type = 'info') {
    if (!formNotice) return;
    formNotice.innerHTML = msg;
    formNotice.className = 'p-4 rounded-xl text-sm font-medium transition-all mb-4 ';
    if (type === 'error') {
      formNotice.className += 'bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-300';
    } else if (type === 'warning') {
      formNotice.className += 'bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300';
    } else {
      formNotice.className += 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300';
    }
    formNotice.classList.remove('hidden');
  }

  function showFormSuccess(name, waLink, customMsg) {
    const successModal = document.getElementById('submissionSuccessModal');
    const successMsg = document.getElementById('successModalMessage');
    const waConfirmBtn = document.getElementById('waConfirmBtn');

    if (successModal && waConfirmBtn) {
      if (successMsg) {
        successMsg.textContent = customMsg || `Thank you ${name}! We have received your inquiry.`;
      }
      waConfirmBtn.href = waLink;
      successModal.classList.remove('hidden');
      successModal.classList.add('flex');
    } else {
      showFormNotice(customMsg, 'success');
    }
  }

  // Close Success Modal
  const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');
  const successModal = document.getElementById('submissionSuccessModal');
  if (closeSuccessModalBtn && successModal) {
    closeSuccessModalBtn.addEventListener('click', () => {
      successModal.classList.add('hidden');
      successModal.classList.remove('flex');
    });
  }
}

// 8. Auto Update Footer Year
function initYear() {
  const yearElem = document.getElementById('currentYear');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }
}


