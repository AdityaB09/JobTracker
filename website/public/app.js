const countEl = document.getElementById("count");
const statusEl = document.getElementById("status");
const tableBody = document.getElementById("tableBody");
const refreshBtn = document.getElementById("refreshBtn");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");

function setStatus(message) {
  statusEl.textContent = message || "";
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadUrls() {
  setStatus("Loading saved URLs...");

  const res = await fetch("/.netlify/functions/list-urls");
  const data = await res.json();

  const rows = Array.isArray(data.items) ? data.items : [];
  countEl.textContent = rows.length;

  tableBody.innerHTML = rows.map((row) => `
    <tr>
      <td>
        <a href="${escapeHtml(row.url)}" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(row.url)}
        </a>
      </td>
      <td>${escapeHtml(row.date)}</td>
    </tr>
  `).join("");

  setStatus(rows.length ? "Loaded successfully." : "No URLs saved yet.");
}

async function saveUrlFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const saveUrl = params.get("saveUrl");

  if (!saveUrl) return;

  setStatus("Saving URL...");

  const res = await fetch("/.netlify/functions/save-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ url: saveUrl })
  });

  const data = await res.json();

  if (!res.ok) {
    setStatus(data.error || "Failed to save URL.");
    return;
  }

  const cleanUrl = window.location.origin + window.location.pathname;
  window.history.replaceState({}, document.title, cleanUrl);

  setStatus(data.message || "URL saved.");
}

refreshBtn.addEventListener("click", async () => {
  await loadUrls();
});

downloadBtn.addEventListener("click", () => {
  window.open("/.netlify/functions/download-csv", "_blank");
});

clearBtn.addEventListener("click", async () => {
  const ok = confirm("This will remove all saved URLs. Continue?");
  if (!ok) return;

  setStatus("Clearing saved URLs...");

  const res = await fetch("/.netlify/functions/clear-urls", {
    method: "POST"
  });

  const data = await res.json();

  if (!res.ok) {
    setStatus(data.error || "Failed to clear URLs.");
    return;
  }

  setStatus(data.message || "All URLs cleared.");
  await loadUrls();
});

(async function init() {
  await saveUrlFromQuery();
  await loadUrls();
})();