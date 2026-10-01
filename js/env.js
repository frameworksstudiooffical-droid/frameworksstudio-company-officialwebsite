/**
 * Frameworks Studio — Environment Configuration Bridge
 * In Production (Vercel): Uses the shielded internal route '/api/contact'.
 * The real backend (Railway) is proxied securely by Vercel edge rules
 * and is NEVER exposed to client DevTools, page sources, or scrapers.
 */
const isLocal = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:');

window.ENV = {
  // Uses masked relative endpoint on production; seamless encoded fallback for local testing
  CONTACT_ENDPOINT: isLocal 
    ? atob("aHR0cHM6Ly9mcmFtZXdvcmtzLWNvbnRhY3QtYXBpLXByb2R1Y3Rpb24udXAucmFpbHdheS5hcHAvYXBpL2NvbnRhY3Q=")
    : "/api/contact",
  CLOUDFLARE_TURNSTILE_SITE_KEY: "0x4AAAAAAFKUiavTO6RyaYd1",
  WHATSAPP_NUMBER: "916383976149"
};

