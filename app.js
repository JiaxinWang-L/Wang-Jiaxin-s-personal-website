(function () {
  const list = document.getElementById("attachment-list");
  const attachments = window.attachments || [];

  function toAssetUrl(path) {
    return path.split("/").map(encodeURIComponent).join("/");
  }

  function isPdf(path) {
    return path.toLowerCase().endsWith(".pdf");
  }

  function createAttachmentItem(item) {
    const url = toAssetUrl(item.file);
    const details = document.createElement("details");
    details.className = "attachment-item";
    details.open = Boolean(item.open);

    const summary = document.createElement("summary");
    summary.textContent = item.title;
    details.appendChild(summary);

    if (item.description) {
      const description = document.createElement("p");
      description.className = "attachment-description";
      description.textContent = item.description;
      details.appendChild(description);
    }

    if (isPdf(item.file)) {
      const frame = document.createElement("iframe");
      frame.src = url;
      frame.title = item.title + " PDF";
      details.appendChild(frame);
    } else {
      const fileNote = document.createElement("p");
      fileNote.className = "attachment-description";
      fileNote.textContent = item.file;
      details.appendChild(fileNote);
    }

    const link = document.createElement("a");
    link.className = "download-link";
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = item.buttonText || "\u6253\u5f00\u6216\u4e0b\u8f7d\u9644\u4ef6";
    details.appendChild(link);

    return details;
  }

  if (!list) {
    return;
  }

  if (attachments.length === 0) {
    const empty = document.createElement("p");
    empty.className = "attachment-description";
    empty.textContent = "\u6682\u65e0\u6210\u679c\u9644\u4ef6";
    list.appendChild(empty);
    return;
  }

  attachments.forEach((item) => {
    if (item && item.title && item.file) {
      list.appendChild(createAttachmentItem(item));
    }
  });
})();
