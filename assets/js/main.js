const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });

const escapeAttribute = (value) => escapeHtml(value);

const normalizeUrl = (url) => {
  const trimmed = url.trim();
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

const isExternalUrl = (url) => /^https?:\/\//i.test(url);
const themeIcons = {
  light: "fa-solid fa-moon",
  dark: "fa-solid fa-sun",
};

const renderInlineMarkdown = (text) => {
  const pattern =
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)|\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)|`([^`]+)`/g;

  let html = "";
  let lastIndex = 0;

  text.replace(
    pattern,
    (
      match,
      imageAlt,
      imageSrc,
      imageTitle,
      linkText,
      linkHref,
      linkTitle,
      inlineCode,
      offset
    ) => {
      html += escapeHtml(text.slice(lastIndex, offset));

      if (typeof inlineCode === "string") {
        html += `<code>${escapeHtml(inlineCode)}</code>`;
      } else if (typeof imageSrc === "string") {
        const src = normalizeUrl(imageSrc);
        const titleAttribute = imageTitle
          ? ` title="${escapeAttribute(imageTitle)}"`
          : "";

        html += `<img src="${escapeAttribute(src)}" alt="${escapeAttribute(
          imageAlt || ""
        )}"${titleAttribute}>`;
      } else {
        const href = normalizeUrl(linkHref);
        const titleAttribute = linkTitle
          ? ` title="${escapeAttribute(linkTitle)}"`
          : "";
        const externalAttributes = isExternalUrl(href)
          ? ' target="_blank" rel="noopener noreferrer"'
          : "";

        html += `<a href="${escapeAttribute(
          href
        )}"${titleAttribute}${externalAttributes}>${escapeHtml(linkText)}</a>`;
      }

      lastIndex = offset + match.length;
      return match;
    }
  );

  html += escapeHtml(text.slice(lastIndex));
  return html;
};

const stripMarkdown = (text) =>
  text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[*_~]/g, "")
    .trim();

const createSlugger = () => {
  const seen = new Map();

  return (text) => {
    const base =
      stripMarkdown(text)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "section";
    const count = seen.get(base) || 0;

    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };
};

const isImageOnlyLine = (line) =>
  /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)\s*$/.test(line.trim());

const renderFigure = (line) => {
  const match = line
    .trim()
    .match(/^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)\s*$/);

  if (!match) {
    return "";
  }

  const [, alt, src, title] = match;
  const normalizedSrc = normalizeUrl(src);
  const titleAttribute = title ? ` title="${escapeAttribute(title)}"` : "";

  return `<figure class="article-figure"><img src="${escapeAttribute(
    normalizedSrc
  )}" alt="${escapeAttribute(alt || "")}"${titleAttribute}></figure>`;
};

const parseList = (lines, startIndex, indentLevel) => {
  let html = "<ul>";
  let index = startIndex;

  while (index < lines.length) {
    const match = lines[index].match(/^(\s*)-\s+(.*)$/);
    if (!match) {
      break;
    }

    const indent = match[1].length;
    if (indent < indentLevel) {
      break;
    }

    if (indent > indentLevel) {
      break;
    }

    let content = match[2].trim();
    index += 1;
    let nestedHtml = "";

    while (index < lines.length) {
      const currentLine = lines[index];
      if (!currentLine.trim()) {
        break;
      }

      const nestedMatch = currentLine.match(/^(\s*)-\s+(.*)$/);
      if (nestedMatch) {
        const nestedIndent = nestedMatch[1].length;

        if (nestedIndent > indentLevel) {
          const nestedList = parseList(lines, index, nestedIndent);
          nestedHtml += nestedList.html;
          index = nestedList.nextIndex;
          continue;
        }

        if (nestedIndent <= indentLevel) {
          break;
        }
      }

      content += ` ${currentLine.trim()}`;
      index += 1;
    }

    html += `<li>${renderInlineMarkdown(content)}${nestedHtml}</li>`;
  }

  html += "</ul>";
  return { html, nextIndex: index };
};

const renderMarkdown = (markdown, options = {}) => {
  const lines = markdown.replace(/\r/g, "").split("\n");
  const slugify = createSlugger();
  const headings = [];
  const fragments = [];
  let title = "";
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();

      if (level === 1 && options.extractTitle && !title) {
        title = stripMarkdown(text);
        index += 1;
        continue;
      }

      const id = slugify(text);
      headings.push({ id, level, text: stripMarkdown(text) });
      fragments.push(
        `<h${level} id="${id}">${renderInlineMarkdown(text)}</h${level}>`
      );
      index += 1;
      continue;
    }

    if (isImageOnlyLine(trimmed)) {
      fragments.push(renderFigure(trimmed));
      index += 1;
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quoteLines = [];
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^\s*>\s?/, "").trim());
        index += 1;
      }

      fragments.push(
        `<blockquote><p>${renderInlineMarkdown(
          quoteLines.join(" ")
        )}</p></blockquote>`
      );
      continue;
    }

    if (/^\s*-\s+/.test(line)) {
      const list = parseList(lines, index, line.match(/^(\s*)/)?.[1].length || 0);
      fragments.push(list.html);
      index = list.nextIndex;
      continue;
    }

    const paragraphLines = [];
    while (index < lines.length) {
      const currentLine = lines[index];
      const currentTrimmed = currentLine.trim();

      if (
        !currentTrimmed ||
        /^(#{1,6})\s+/.test(currentTrimmed) ||
        /^\s*>\s?/.test(currentLine) ||
        /^\s*-\s+/.test(currentLine) ||
        isImageOnlyLine(currentTrimmed)
      ) {
        break;
      }

      paragraphLines.push(currentTrimmed);
      index += 1;
    }

    if (paragraphLines.length > 0) {
      fragments.push(
        `<p>${renderInlineMarkdown(paragraphLines.join(" "))}</p>`
      );
      continue;
    }

    index += 1;
  }

  return {
    html: fragments.join(""),
    title,
    headings,
  };
};

const renderToc = (headings) => {
  const visibleHeadings = headings.filter(
    (heading) => heading.level >= 2 && heading.level <= 3
  );

  if (visibleHeadings.length === 0) {
    return "";
  }

  let html = "<h2>On this page</h2><ul>";
  let hasOpenItem = false;
  let hasNestedList = false;

  visibleHeadings.forEach((heading) => {
    if (heading.level === 2) {
      if (hasNestedList) {
        html += "</ul>";
        hasNestedList = false;
      }

      if (hasOpenItem) {
        html += "</li>";
      }

      html += `<li><a href="#${escapeAttribute(heading.id)}">${escapeHtml(
        heading.text
      )}</a>`;
      hasOpenItem = true;
      return;
    }

    if (!hasOpenItem) {
      html += `<li><a href="#${escapeAttribute(heading.id)}">${escapeHtml(
        heading.text
      )}</a></li>`;
      return;
    }

    if (!hasNestedList) {
      html += "<ul>";
      hasNestedList = true;
    }

    html += `<li><a href="#${escapeAttribute(heading.id)}">${escapeHtml(
      heading.text
    )}</a></li>`;
  });

  if (hasNestedList) {
    html += "</ul>";
  }

  if (hasOpenItem) {
    html += "</li>";
  }

  html += "</ul>";
  return html;
};

const initializeNavigation = () => {
  const nav = document.getElementById("main-nav");
  const toggle = document.querySelector(".nav-toggle");
  if (!nav || !toggle) {
    return;
  }

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
};

const initializeTableOfContents = () => {
  const tocToggle = document.querySelector(".toc-toggle");
  const tocList = document.getElementById("toc-list");
  if (!tocToggle || !tocList) {
    return;
  }

  const toggleToc = () => {
    const isOpen = tocList.classList.toggle("is-open");
    tocToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  };

  tocToggle.addEventListener("click", toggleToc);
};

const initializeThemeToggle = () => {
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) {
    return;
  }

  const icon = toggle.querySelector("i");

  const applyThemeState = (theme) => {
    const isDark = theme === "dark";
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    toggle.setAttribute("aria-pressed", isDark ? "true" : "false");
    toggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
    toggle.setAttribute(
      "title",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );

    if (icon) {
      icon.className = themeIcons[isDark ? "dark" : "light"];
    }
  };

  const storedTheme =
    document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  applyThemeState(storedTheme);

  toggle.addEventListener("click", () => {
    const nextTheme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("theme", nextTheme);
    } catch (error) {}
    applyThemeState(nextTheme);
  });
};

const initializeClickableCards = () => {
  const cards = document.querySelectorAll("[data-card-link]");
  if (cards.length === 0) {
    return;
  }

  const navigateToCard = (card) => {
    const href = card.getAttribute("data-card-link");
    if (!href) {
      return;
    }

    if (card.getAttribute("data-card-new-tab") === "true") {
      window.open(href, "_blank", "noopener");
      return;
    }

    window.location.href = href;
  };

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        return;
      }

      navigateToCard(card);
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      if (event.target.closest("a")) {
        return;
      }

      event.preventDefault();
      navigateToCard(card);
    });
  });
};

const initializeMarkdownArticle = async () => {
  const article = document.querySelector("[data-markdown-source]");
  if (!article) {
    return;
  }

  const source = article.getAttribute("data-markdown-source");
  if (!source) {
    return;
  }

  const titleTarget = document.querySelector("[data-markdown-title]");
  const breadcrumbCurrent = document.querySelector("[data-breadcrumb-current]");
  const toc = document.getElementById("TOC");
  const tocAside = document.querySelector(".article-toc");

  try {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Unable to load markdown from ${source}`);
    }

    const markdown = await response.text();
    const rendered = renderMarkdown(markdown, {
      extractTitle: article.dataset.extractTitle === "true",
    });

    article.innerHTML =
      rendered.html || '<p class="article-loading">No project summary available.</p>';

    if (rendered.title) {
      if (titleTarget) {
        titleTarget.textContent = rendered.title;
      }

      if (breadcrumbCurrent) {
        breadcrumbCurrent.textContent = rendered.title;
      }

      document.title = `Miguel Castillo - ${rendered.title}`;
    }

    if (toc) {
      const tocMarkup = renderToc(rendered.headings);
      if (tocMarkup) {
        toc.innerHTML = tocMarkup;
        tocAside?.removeAttribute("hidden");
      } else {
        toc.innerHTML = "";
        tocAside?.setAttribute("hidden", "hidden");
      }
    }
  } catch (error) {
    article.innerHTML =
      '<p class="article-error">Unable to load this project summary right now.</p>';
    tocAside?.setAttribute("hidden", "hidden");
    console.error(error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initializeThemeToggle();
  initializeNavigation();
  initializeTableOfContents();
  initializeClickableCards();
  void initializeMarkdownArticle();
});
