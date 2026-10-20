/**
 * GIDEA-IFPD i18n Engine
 * Internationalization system supporting ES, EN, FR, PT
 * Uses localStorage to remember user language preference.
 * Handles bfcache (pageshow event) to ensure consistent language when navigating back/forward.
 */
const i18n = (() => {
  const STORAGE_KEY = 'gidea_lang';
  const LEGACY_STORAGE_KEY = 'gidea_lang_v13';
  const DEFAULT_LANG = 'en';
  let currentLang = DEFAULT_LANG;
  let translations = {};

  // Country list for all 4 languages
  const countryLists = {
    es: ["Argentina","Bolivia","Brasil","Chile","Colombia","Costa Rica","Cuba","Ecuador","El Salvador","España","Guatemala","Honduras","México","Nicaragua","Panamá","Paraguay","Perú","Portugal","Puerto Rico","República Dominicana","Uruguay","Venezuela","Estados Unidos","Canadá","Francia","Reino Unido","Alemania","Italia","Países Bajos","Bélgica","Suiza","Portugal","Nigeria","Sudáfrica","Etiopía","Kenia","Egipto","Marruecos","Angola","Mozambique","Tanzania","Ghana","Camerún","Costa de Marfil","Senegal","Zambia","Zimbabue","Ruanda","Uganda","Malí","Burkina Faso","Níger","Chad","Sudán","Somalia","Libia","Argelia","Túnez","China","India","Japón","Corea del Sur","Indonesia","Australia","Nueva Zelanda","Singapur","Emiratos Árabes Unidos","Arabia Saudita","Qatar","Kuwait","Bahréin","Omán","Otro"],
    en: ["Argentina","Bolivia","Brazil","Chile","Colombia","Costa Rica","Cuba","Ecuador","El Salvador","Guatemala","Honduras","Mexico","Nicaragua","Panamá","Paraguay","Peru","Dominican Republic","Uruguay","Venezuela","United States","Canada","United Kingdom","France","Germany","Italy","Spain","Netherlands","Belgium","Switzerland","Portugal","Australia","New Zealand","Japan","China","India","South Korea","Singapore","United Arab Emirates","Saudi Arabia","Qatar","South Africa","Nigeria","Kenya","Morocco","Egypt","Other"],
    fr: ["Argentine","Bolivie","Brésil","Chili","Colombie","Costa Rica","Cuba","Équateur","El Salvador","Guatemala","Honduras","Mexique","Nicaragua","Panama","Paraguay","Pérou","République Dominicaine","Uruguay","Venezuela","États-Unis","Canada","Royaume-Uni","France","Allemagne","Italie","Espagne","Pays-Bas","Belgique","Suisse","Portugal","Australie","Nouvelle-Zélande","Japon","Chine","Inde","Corée du Sud","Singapour","Émirats Arabes Unis","Arabie Saoudite","Qatar","Afrique du Sud","Nigéria","Kenya","Maroc","Égypte","Autre"],
    pt: ["Argentina","Bolívia","Brasil","Chile","Colômbia","Costa Rica","Cuba","Equador","El Salvador","Guatemala","Honduras","México","Nicarágua","Panamá","Paraguai","Peru","República Dominicana","Uruguai","Venezuela","Estados Unidos","Canadá","Reino Unido","França","Alemanha","Itália","Espanha","Países Baixos","Bélgica","Suíça","Portugal","Austrália","Nova Zelândia","Japão","China","Índia","Coreia do Sul","Singapura","Emirados Árabes Unidos","Arábia Saudita","Catar","África do Sul","Nigéria","Quênia","Marrocos","Egito","Outro"]
  };

  async function loadTranslations(lang) {
    const basePath = window.location.pathname.includes('/services/') ? '../assets/locales/' : 'assets/locales/';
    const resp = await fetch(`${basePath}${lang}.json?v=25`);
    if (!resp.ok) throw new Error(`Could not load locale: ${lang}`);
    return resp.json();
  }

  function applyTranslations(t) {
    // Apply text to all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = t[key];
        } else if (typeof t[key] === 'string' && t[key].includes('<') && t[key].includes('>')) {
          el.innerHTML = t[key];
        } else {
          el.textContent = t[key];
        }
      }
    });

    // Apply placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) el.placeholder = t[key];
    });

    // Rebuild country select
    const countrySelect = document.getElementById('form-country');
    if (countrySelect) {
      const currentVal = countrySelect.value;
      const countries = countryLists[currentLang] || countryLists.es;
      const defaultOpt = `<option value="">${t['form_country'] || 'País'}</option>`;
      const opts = countries.map(c => `<option value="${c}"${c === currentVal ? ' selected' : ''}>${c}</option>`).join('');
      countrySelect.innerHTML = defaultOpt + opts;
    }

    // Update html lang attribute
    document.documentElement.lang = currentLang;

    // Update select options for form_subject
    const subjectSelect = document.getElementById('form-subject');
    if (subjectSelect) {
      const opts = [0,1,2,3,4,5,6,7,8].map(i => {
        const key = `form_subject_opt${i}`;
        return `<option value="${i === 0 ? '' : t[`form_subject_opt${i}`] || ''}">${t[key] || ''}</option>`;
      }).join('');
      subjectSelect.innerHTML = opts;
    }

    // Update hidden form lang
    const formLang = document.getElementById('form-lang');
    if (formLang) formLang.value = currentLang;
  }

  function updateLangSelector(lang) {
    // Mark active button in dropdown
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Update trigger button: show correct icon (flag for EN, globe for others)
    const activeBtn = document.querySelector(`.lang-btn[data-lang="${lang}"]`);
    if (!activeBtn) return;

    const isFlag = activeBtn.getAttribute('data-icon') === 'flag';
    const flagEl  = document.querySelector('#langToggle .fi');
    const globeEl = document.querySelector('#langToggle .lang-globe');
    const codeEl  = document.getElementById('currentLangCode');

    if (flagEl)  flagEl.style.display  = isFlag ? '' : 'none';
    if (globeEl) globeEl.style.display = isFlag ? 'none' : '';
    if (codeEl)  codeEl.textContent    = activeBtn.getAttribute('data-code') || lang.toUpperCase();
  }

  async function setLanguage(lang) {
    try {
      translations = await loadTranslations(lang);
      currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      localStorage.setItem(LEGACY_STORAGE_KEY, lang);
      applyTranslations(translations);
      updateLangSelector(lang);
    } catch (e) {
      console.error('i18n error:', e);
    }
  }

  function getStoredLanguage() {
    return localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY) || DEFAULT_LANG;
  }

  function init() {
    const savedLang = getStoredLanguage();

    // Bind language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedLang = btn.getAttribute('data-lang');
        setLanguage(selectedLang);

        // Close dropdown
        const langSelector = document.querySelector('.lang-selector');
        const langToggle = document.getElementById('langToggle');
        if (langSelector) langSelector.classList.remove('open');
        if (langToggle) langToggle.setAttribute('aria-expanded', 'false');

        // Close mobile menu if open
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navRight = document.getElementById('navRight');
        if (mobileMenuBtn && navRight && navRight.classList.contains('active')) {
          mobileMenuBtn.classList.remove('active');
          navRight.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });

    // Load initial language
    setLanguage(savedLang);
  }

  // Handle BFCache (Back/Forward Cache) when user presses browser Back/Forward
  window.addEventListener('pageshow', (event) => {
    const savedLang = getStoredLanguage();
    if (savedLang && savedLang !== currentLang) {
      setLanguage(savedLang);
    }
  });

  // Handle cross-tab or cross-window language changes
  window.addEventListener('storage', (e) => {
    if ((e.key === STORAGE_KEY || e.key === LEGACY_STORAGE_KEY) && e.newValue && e.newValue !== currentLang) {
      setLanguage(e.newValue);
    }
  });

  return { init, setLanguage, getCurrentLang: () => currentLang };
})();

document.addEventListener('DOMContentLoaded', () => {
  i18n.init();
});
