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

    /* ===== 1. LOADING SCREEN ===== */
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

      setTimeout(() => {
        if (pageLoader) {
          pageLoader.classList.add("is-done");
          document.body.classList.remove("is-loading");
          document.body.classList.add("page-ready");
          setTimeout(() => pageLoader.remove(), 900);
        }
      }, 350);
    }

    const loaderStart = performance.now();
    const minimumLoaderTime = 1600;

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
    });

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", () => {
        mobileNav.classList.toggle("active");
        menuButton.textContent = mobileNav.classList.contains("active") ? "×" : "☰";
      });

      mobileNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
          mobileNav.classList.remove("active");
          menuButton.textContent = "☰";
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
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

    /* ===== 4. PRICING TIER SELECTORS ===== */
    document.querySelectorAll('.price-row').forEach(row => {
      row.addEventListener('click', () => {
        const service = row.getAttribute('data-service');
        const budget = row.getAttribute('data-budget');
        const plan = row.getAttribute('data-plan');

        const serviceSelect = document.getElementById('service');
        const budgetSelect = document.getElementById('budget');
        const messageBox = document.getElementById('message');

        if (serviceSelect && service) serviceSelect.value = service;
        if (budgetSelect && budget) budgetSelect.value = budget;
        if (messageBox && plan) {
          messageBox.value = `Interested in ${plan}. Looking forward to discussing specifications.`;
        }

        const contactSec = document.getElementById('contact');
        if (contactSec) {
          contactSec.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    /* ===== 5. LIVE PREVIEW MODAL ===== */
    const previewModal = document.getElementById('previewModal');
    const previewFrame = document.getElementById('previewIframe');
    const previewTitle = document.getElementById('previewTitle');
    const previewUrl = document.getElementById('previewUrl');
    const previewExternalBtn = document.getElementById('previewExternalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const frameContainer = document.getElementById('frameContainer');
    const deviceButtons = document.querySelectorAll('[data-device-width]');

    function openModal(url, displayUrl, title) {
      if (!previewModal || !previewFrame) return;
      previewTitle.textContent = title || 'Live Client Demo';
      previewUrl.textContent = displayUrl || url;
      previewExternalBtn.href = url;
      previewFrame.src = url;

      if (frameContainer) frameContainer.style.maxWidth = '100%';
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
    }

    document.querySelectorAll('[data-preview-url]').forEach(el => {
      el.addEventListener('click', (e) => {
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
        if (frameContainer) frameContainer.style.maxWidth = width;
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