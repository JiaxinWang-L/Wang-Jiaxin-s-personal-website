(function () {
  const owner = "JiaxinWang-L";
  const repo = "Wang-Jiaxin-s-personal-website";
  const pdfFolder = "PDF";
  const list = document.getElementById("pdf-list");

  const titleOverrides = {
    "01.pdf": "\u672c\u79d1\u9636\u6bb5\u6210\u679c",
    "MASTER.pdf": "\u7855\u58eb\u9636\u6bb5\u6210\u679c",
    "11\u946b\u6d77\u5956\u5b66\u91d1-\u8d44\u6e90\u4e0e\u571f\u6728\u5de5\u7a0b\u5b66\u96622024\u7ea7\u7855\u58eb\u7814\u7a76\u751f\u547d\u540d\u5956\u5b66\u91d1\u516c\u793a.pdf": "\u946b\u6d77\u5956\u5b66\u91d1\u516c\u793a",
    "\u4e13\u5229\u767b\u8bb02025FZ04244-ZQ257283I-YS-\u529e\u7406\u767b\u8bb0\u624b\u7eed\u901a\u77e5\u4e66 (1).pdf": "\u4e13\u5229\u767b\u8bb0\u901a\u77e5\u4e66"
  };

  const fallbackPdfNames = Object.keys(titleOverrides);

  function isPdf(name) {
    return name.toLowerCase().endsWith(".pdf");
  }

  function toPdfUrl(name) {
    return pdfFolder + "/" + encodeURIComponent(name);
  }

  function cleanTitle(name) {
    return titleOverrides[name] || name.replace(/\.pdf$/i, "");
  }

  function createPdfCard(name) {
    const title = cleanTitle(name);
    const url = toPdfUrl(name);
    const article = document.createElement("article");
    article.className = "result-item";

    const heading = document.createElement("h3");
    heading.textContent = title;
    article.appendChild(heading);

    const description = document.createElement("p");
    description.className = "attachment-description";
    description.textContent = "\u9644\u4ef6\u5185\u5bb9\uff1a" + title;
    article.appendChild(description);

    const frame = document.createElement("iframe");
    frame.className = "pdf-preview";
    frame.src = url;
    frame.title = title + " PDF";
    article.appendChild(frame);

    const link = document.createElement("a");
    link.className = "download-link";
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "\u6253\u5f00\u6216\u4e0b\u8f7d PDF";
    article.appendChild(link);

    return article;
  }

  function renderPdfList(names) {
    list.innerHTML = "";

    if (names.length === 0) {
      const empty = document.createElement("p");
      empty.className = "loading-message";
      empty.textContent = "PDF \u6587\u4ef6\u5939\u6682\u65e0 PDF\u3002";
      list.appendChild(empty);
      return;
    }

    names.forEach((name) => {
      list.appendChild(createPdfCard(name));
    });
  }

  async function loadFromGithub() {
    const apiUrl = "https://api.github.com/repos/" + owner + "/" + repo + "/contents/" + pdfFolder;
    const response = await fetch(apiUrl, { headers: { Accept: "application/vnd.github+json" } });

    if (!response.ok) {
      throw new Error("GitHub API request failed");
    }

    const files = await response.json();
    return files
      .filter((file) => file.type === "file" && isPdf(file.name))
      .map((file) => file.name);
  }

  async function loadFromLocalDirectory() {
    const response = await fetch(pdfFolder + "/");

    if (!response.ok) {
      throw new Error("Local directory listing unavailable");
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    return Array.from(doc.querySelectorAll("a[href]"))
      .map((link) => link.getAttribute("href").split("/").pop())
      .map((name) => decodeURIComponent(name || ""))
      .filter(isPdf);
  }

  async function loadPdfNames() {
    const isLocalPreview = location.hostname === "localhost" || location.hostname === "127.0.0.1";

    if (isLocalPreview) {
      try {
        const localNames = await loadFromLocalDirectory();
        if (localNames.length > 0) {
          return localNames;
        }
      } catch (error) {
        // GitHub Pages cannot list folders; this is only for local preview.
      }
    }

    return loadFromGithub();
  }

  if (!list) {
    return;
  }

  loadPdfNames()
    .then((names) => {
      const uniqueNames = Array.from(new Set(names)).sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));
      renderPdfList(uniqueNames);
    })
    .catch(() => {
      renderPdfList(fallbackPdfNames);
    });
})();
