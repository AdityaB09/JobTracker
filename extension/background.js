const WEBSITE_BASE_URL = "https://jobtracker-aditya.netlify.app";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-link-to-website",
    title: "Save link to URL website",
    contexts: ["link"]
  });

  chrome.contextMenus.create({
    id: "save-page-to-website",
    title: "Save current page URL to website",
    contexts: ["page"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  let urlToSave = null;

  if (info.menuItemId === "save-link-to-website" && info.linkUrl) {
    urlToSave = info.linkUrl;
  }

  if (info.menuItemId === "save-page-to-website" && tab?.url) {
    urlToSave = tab.url;
  }

  if (!urlToSave) return;

  const target =
    `${WEBSITE_BASE_URL}/?saveUrl=${encodeURIComponent(urlToSave)}`;

  chrome.tabs.create({ url: target });
});