/* ===== 0. GLOBAL TURNSTILE CALLBACKS ===== */
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
      console.warn("Turnstile verification error or fallback mode.");
    };

    /* ===== 1. HIGH-PERFORMANCE SMART LOADER ===== */
    const pageLoader = document.getElementById("pageLoader");
    const loaderPercent = document.getElementById("loaderPercent");
    const loaderBar = document.getElementById("loaderBar");
    const loaderStatus = document.getElementById("loaderStatus");

    const loaderMessages = [
      [0, "Preparing digital experience"],
      [25, "Loading design system"],
      [50, "Building interface architecture"],
      [75, "Polishing typography & layouts"],
      [92, "Almost there"],
      [100, "Welcome to Frameworks Studio"]
    ];

    let progress = 0;
    let finished = false;

    function updateLoader(value) {
      progress = Math.min(100, value);
      if (loaderPercent) loaderPercent.textContent = `${Math.round(progress)}%`;
      if (loaderBar) loaderBar.style.width = `${progress}%`;

      let message = loaderMessages[0][1];
      for (const [point, text] of loaderMessages) {
        if (progress >= point) message = text;
      }
      if (loaderStatus) loaderStatus.textContent = message;
    }

    function finishLoader() {
      if (finished) return;
      finished = true;
      updateLoader(100);
      try { sessionStorage.setItem("fs_visited", "1"); } catch(e){}

      setTimeout(() => {
        if (pageLoader) {
          pageLoader.classList.add("is-done");
          document.body.classList.remove("is-loading");
          document.body.classList.add("page-ready");
          setTimeout(() => pageLoader.remove(), 600);
        }
      }, 250);
    }

    const loaderStart = performance.now();
    let isReturning = false;
    try { isReturning = sessionStorage.getItem("fs_visited") === "1"; } catch(e){}
    const minimumLoaderTime = isReturning ? 250 : 550;

    function animateLoader(now) {
      const elapsed = now - loaderStart;
      const simulated = Math.min(96, (elapsed / minimumLoaderTime) * 96);
      updateLoader(simulated);

      if (elapsed < minimumLoaderTime) {
        requestAnimationFrame(animateLoader);
      } else {
        if (document.readyState === "complete") {
          finishLoader();
        } else {
          window.addEventListener("load", finishLoader, { once: true });
        }
      }
    }

    requestAnimationFrame(animateLoader);

    window.addEventListener("load", () => {
      if (performance.now() - loaderStart >= minimumLoaderTime) finishLoader();
    }, { once: true });

    /* ===== 2. SCROLL & NAVIGATION ===== */
    const nav = document.getElementById("nav");
    const menuButton = document.getElementById("menuButton");
    const mobileNav = document.getElementById("mobileNav");

    window.addEventListener("scroll", () => {
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 35);
    }, { passive: true });

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", () => {
        const isOpen = mobileNav.classList.toggle("active");
        menuButton.textContent = isOpen ? "×" : "☰";
        document.body.style.overflow = isOpen ? "hidden" : "";
      });

      mobileNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
          mobileNav.classList.remove("active");
          menuButton.textContent = "☰";
          document.body.style.overflow = "";
        });
      });
    }

    // ScrollSpy: highlight active nav section as user scrolls
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    const trackedSections = Array.from(navAnchors)
      .map(a => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);

    window.addEventListener("scroll", () => {
      let currentId = "";
      const scrollPos = window.scrollY + 120;
      trackedSections.forEach(sec => {
        if (sec.offsetTop <= scrollPos) {
          currentId = "#" + sec.id;
        }
      });
      navAnchors.forEach(a => {
        if (a.getAttribute("href") === currentId) {
          a.classList.add("active");
        } else {
          a.classList.remove("active");
        }
      });
    }, { passive: true });

    /* ===== 3. INTERSECTION OBSERVER REVEAL ===== */
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

    /* ===== 4. PRICING TIER 1-CLICK SELECTORS ===== */
    function selectPlan(row) {
      if (!row) return;
      const service = row.getAttribute('data-service');
      const budget = row.getAttribute('data-budget');
      const plan = row.getAttribute('data-plan');

      const serviceSelect = document.getElementById('service');
      const budgetSelect = document.getElementById('budget');
      const messageBox = document.getElementById('message');
      const contactForm = document.getElementById('contactForm');

      if (serviceSelect && service) {
        serviceSelect.value = service;
        document.querySelectorAll('.chip-btn[data-target="service"]').forEach(c => {
          c.classList.toggle('active', c.getAttribute('data-val') === service);
        });
      }
      if (budgetSelect && budget) {
        budgetSelect.value = budget;
        document.querySelectorAll('.chip-btn[data-target="budget"]').forEach(c => {
          c.classList.toggle('active', c.getAttribute('data-val') === budget);
        });
      }
      if (messageBox && plan) {
        messageBox.value = `Interested in ${plan}. Looking forward to discussing specifications and kickoff.`;
      }

      const contactSec = document.getElementById('contact');
      if (contactSec) {
        contactSec.scrollIntoView({ behavior: 'smooth' });
      }
      if (contactForm) {
        contactForm.classList.remove('form-flash-selected');
        void contactForm.offsetWidth;
        contactForm.classList.add('form-flash-selected');
        setTimeout(() => contactForm.classList.remove('form-flash-selected'), 1800);
      }
    }

    document.querySelectorAll('.price-row').forEach(row => {
      row.addEventListener('click', (e) => {
        // If clicking inside another button, let that button handle it
        if (e.target.closest('.btn-select-tier')) return;
        selectPlan(row);
      });
    });

    document.querySelectorAll('.btn-select-tier').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const row = btn.closest('.price-row');
        selectPlan(row);
      });
    });

    /* ===== 5. INTERACTIVE FORM QUICK-CHIPS ===== */
    document.querySelectorAll('.chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        const targetId = chip.getAttribute('data-target');
        const val = chip.getAttribute('data-val');
        const select = document.getElementById(targetId);

        document.querySelectorAll(`.chip-btn[data-target="${targetId}"]`).forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        if (select) {
          select.value = val;
          select.dispatchEvent(new Event('change'));
        }
      });
    });

    // Sync select dropdown changes back to chips
    ['service', 'budget'].forEach(fieldId => {
      const select = document.getElementById(fieldId);
      if (select) {
        select.addEventListener('change', () => {
          document.querySelectorAll(`.chip-btn[data-target="${fieldId}"]`).forEach(c => {
            c.classList.toggle('active', c.getAttribute('data-val') === select.value);
          });
        });
      }
    });

    /* ===== 6. LIVE PREVIEW MODAL WITH SKELETON LOADER & BEZELS ===== */
    const previewModal = document.getElementById('previewModal');
    const previewFrame = document.getElementById('previewIframe');
    const previewTitle = document.getElementById('previewTitle');
    const previewUrl = document.getElementById('previewUrl');
    const previewExternalBtn = document.getElementById('previewExternalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const frameContainer = document.getElementById('frameContainer');
    const deviceButtons = document.querySelectorAll('[data-device-width]');

    // Ensure frameLoader skeleton exists
    let frameLoader = document.getElementById('frameLoader');
    if (!frameLoader && frameContainer) {
      frameLoader = document.createElement('div');
      frameLoader.id = 'frameLoader';
      frameLoader.className = 'frame-loader';
      frameLoader.innerHTML = '<div class="frame-spinner"></div><span>Connecting to live edge deployment...</span>';
      frameContainer.appendChild(frameLoader);
    }

    function openModal(url, displayUrl, title) {
      if (!previewModal || !previewFrame) return;
      previewTitle.textContent = title || 'Live Client Demo';
      previewUrl.textContent = displayUrl || url;
      previewExternalBtn.href = url;

      if (frameLoader) frameLoader.classList.remove('hidden');
      previewFrame.src = url;
      previewFrame.onload = () => {
        if (frameLoader) frameLoader.classList.add('hidden');
      };

      if (frameContainer) {
        frameContainer.style.maxWidth = '100%';
        frameContainer.classList.remove('device-tablet', 'device-mobile');
        frameContainer.classList.add('device-desktop');
      }
      deviceButtons.forEach(btn => btn.classList.remove('active'));
      const defBtn = document.querySelector('[data-device-width="100%"]');
      if (defBtn) defBtn.classList.add('active');

      previewModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      if (!previewModal || !previewFrame) return;
      previewModal.classList.remove('active');
      previewFrame.src = 'about:blank';
      document.body.style.overflow = 'auto';
      if (frameLoader) frameLoader.classList.remove('hidden');
    }

    document.querySelectorAll('[data-preview-url]').forEach(el => {
      el.addEventListener('click', (e) => {
        // If clicking an external direct link inside the card, let standard navigation occur
        if (e.target.closest('.link-site') || e.target.classList.contains('link-site')) return;
        e.preventDefault();
        const url = el.getAttribute('data-preview-url');
        const displayUrl = el.getAttribute('data-display-url') || url;
        const title = el.getAttribute('data-preview-title') || 'Live Client Demo';
        openModal(url, displayUrl, title);
      });
    });

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (previewModal) {
      previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && previewModal && previewModal.classList.contains('active')) {
        closeModal();
      }
    });

    deviceButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const width = btn.getAttribute('data-device-width');
        deviceButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (frameContainer) {
          frameContainer.style.maxWidth = width;
          frameContainer.classList.remove('device-desktop', 'device-tablet', 'device-mobile');
          if (width === '768px') frameContainer.classList.add('device-tablet');
          else if (width === '375px') frameContainer.classList.add('device-mobile');
          else frameContainer.classList.add('device-desktop');
        }
      });
    });

    /* ===== 6. CONTACT FORM API INTEGRATION ===== */
    const contactForm = document.getElementById('contactForm');
    const formNotice = document.getElementById('formNotice');
    const submitBtn = document.getElementById('contactSubmitBtn');
    const submitBtnText = document.getElementById('submitBtnText');
    const successModal = document.getElementById('submissionSuccessModal');
    const successMsg = document.getElementById('successModalMessage');
    const waConfirmBtn = document.getElementById('waConfirmBtn');
    const closeSuccessModalBtn = document.getElementById('closeSuccessModalBtn');

    function showNotice(msg, type = 'error') {
      if (!formNotice) return;
      formNotice.textContent = msg;
      formNotice.className = `form-notice full ${type}`;
      formNotice.classList.remove('hidden');
    }

    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const phone = document.getElementById('phone')?.value.trim() || '';
        const business = document.getElementById('business')?.value.trim() || '';
        const service = document.getElementById('service')?.value || '';
        const budget = document.getElementById('budget')?.value || '';
        const message = document.getElementById('message')?.value.trim() || '';
        const botField = document.getElementById('bot_field')?.value || '';

        // Validation
        if (!name || name.length < 2) {
          showNotice('Please enter your full name.', 'error');
          return;
        }
        if (!email || !email.includes('@')) {
          showNotice('Please enter a valid email address.', 'error');
          return;
        }
        if (!message || message.length < 10) {
          showNotice('Please provide a brief overview of your project (at least 10 characters).', 'error');
          return;
        }

        // WhatsApp Link for instant fallback or confirmation
        const waNum = (window.ENV && window.ENV.WHATSAPP_NUMBER) || '916383976149';
        const waText = encodeURIComponent(
          `*New Project Brief — Frameworks Studio*\n\n` +
          `👤 *Name:* ${name}\n` +
          `🏢 *Company:* ${business || 'N/A'}\n` +
          `📧 *Email:* ${email}\n` +
          `📞 *Phone:* ${phone || 'N/A'}\n` +
          `🛠️ *Service:* ${service || 'General Inquiry'}\n` +
          `💰 *Budget:* ${budget || 'N/A'}\n\n` +
          `📝 *Message:*\n${message}`
        );
        const waLink = `https://wa.me/${waNum}?text=${waText}`;

        // Construct Strict API Payload
        const payload = {
          name: name.replace(/[\r\n]/g, ' '),
          email: email,
          phone: phone ? phone.substring(0, 30) : null,
          company: business ? business.substring(0, 100) : null,
          business_type: service ? service.substring(0, 100) : null,
          timeline: budget ? budget.substring(0, 100) : null,
          message: message,
          bot_field: botField || null,
          "cf-turnstile-response": window.turnstileToken || ""
        };

        // Loading UI
        if (submitBtn) submitBtn.disabled = true;
        if (submitBtnText) submitBtnText.textContent = 'Transmitting brief...';
        if (formNotice) formNotice.classList.add('hidden');

        const endpoint = (window.ENV && window.ENV.CONTACT_ENDPOINT) || '/api/contact';

        try {
          // Obfuscation decoy: fire concurrent verification request in Network tab
          const decoyPayload = {
            telemetry_ref: "tx_" + Math.random().toString(36).substring(2, 10),
            client_id: "cl_" + Math.random().toString(36).substring(2, 8),
            channel: "brief_dispatch_v2",
            timestamp: Date.now()
          };

          fetch('/api/v2/verify-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(decoyPayload)
          }).catch(function() {}); // Decoupled: failures will never interrupt email delivery

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          const data = await response.json().catch(() => null);

          if (response.ok) {
            // Success
            if (successModal && waConfirmBtn) {
              if (successMsg) {
                successMsg.textContent = `Thank you ${name}! Your project specifications have been delivered to our engineering desk.`;
              }
              waConfirmBtn.href = waLink;
              successModal.classList.add('active');
            } else {
              showNotice(`Thank you ${name}! We have received your inquiry.`, 'success');
            }

            contactForm.reset();
            if (window.turnstile) {
              try { window.turnstile.reset(); } catch(err){}
            }
            window.turnstileToken = "";
          } else {
            // Error from API
            const errorMsg = data?.message || 'Server encountered an issue. You can connect directly via WhatsApp.';
            showNotice(errorMsg, 'warning');
          }
        } catch (netErr) {
          console.error("Network or submission error:", netErr);
          // Seamless WhatsApp Direct Connect Fallback
          showNotice(`Server unavailable. Click WhatsApp below to send your brief directly.`, 'warning');
          if (successModal && waConfirmBtn) {
            if (successMsg) {
              successMsg.textContent = `Please tap below to send your brief directly to our technical director via WhatsApp (+91 6383976149).`;
            }
            waConfirmBtn.href = waLink;
            successModal.classList.add('active');
          }
        } finally {
          if (submitBtn) submitBtn.disabled = false;
          if (submitBtnText) submitBtnText.textContent = 'Send project brief';
        }
      });
    }

    if (closeSuccessModalBtn && successModal) {
      closeSuccessModalBtn.addEventListener('click', () => {
        successModal.classList.remove('active');
      });
      successModal.addEventListener('click', (e) => {
        if (e.target === successModal) successModal.classList.remove('active');
      });
    }

    /* ===== 7. URL PARAMETER SYNC FOR CONTACT FORM ===== */
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const paramService = urlParams.get('service');
      const paramBudget = urlParams.get('budget');
      const paramPlan = urlParams.get('plan');

      if (paramService || paramBudget || paramPlan) {
        const serviceSelect = document.getElementById('service');
        const budgetSelect = document.getElementById('budget');
        const messageBox = document.getElementById('message');
        const contactForm = document.getElementById('contactForm');

        if (serviceSelect && paramService) {
          serviceSelect.value = paramService;
          document.querySelectorAll('.chip-btn[data-target="service"]').forEach(c => {
            c.classList.toggle('active', c.getAttribute('data-val') === paramService);
          });
        }
        if (budgetSelect && paramBudget) {
          budgetSelect.value = paramBudget;
          document.querySelectorAll('.chip-btn[data-target="budget"]').forEach(c => {
            c.classList.toggle('active', c.getAttribute('data-val') === paramBudget);
          });
        }
        if (messageBox && paramPlan) {
          messageBox.value = `Interested in ${paramPlan}. Looking forward to discussing specifications and kickoff.`;
        }
        if (contactForm) {
          contactForm.classList.add('form-flash-selected');
          setTimeout(() => contactForm.classList.remove('form-flash-selected'), 1800);
        }
      }
    } catch(paramErr) {}