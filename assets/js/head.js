(() => {
  try {
    const theme = localStorage.getItem("theme");
    document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
  } catch (error) {
    document.documentElement.dataset.theme = "light";
  }

  const gaId = "G-PNGVGH6KBW";
  if (window.__siteAnalyticsInitialized) {
    return;
  }

  window.__siteAnalyticsInitialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  const gaScript = document.createElement("script");
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(gaScript);

  window.gtag("js", new Date());
  window.gtag("config", gaId);
})();
