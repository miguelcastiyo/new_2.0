document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("main-nav");
  const toggle = document.querySelector(".nav-toggle");
  if (!nav || !toggle) return;

  const links = nav.querySelectorAll("a");

  const closeNav = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const toggleNav = () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  };

  toggle.addEventListener("click", toggleNav);
  links.forEach((link) => link.addEventListener("click", closeNav));

  const tocToggle = document.querySelector(".toc-toggle");
  const tocList = document.getElementById("toc-list");
  if (tocToggle && tocList) {
    const toggleToc = () => {
      const isOpen = tocList.classList.toggle("is-open");
      tocToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };

    tocToggle.addEventListener("click", toggleToc);
  }
});
