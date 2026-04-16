const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return response(405, { error: "Method not allowed" });
    }

    const body = JSON.parse(event.body || "{}");
    const url = String(body.url || "").trim();

    if (!url) {
      return response(400, { error: "URL is required." });
    }

    const store = getStore("saved-urls");
    const existing = (await store.get("urls", { type: "json" })) || [];

    const alreadyExists = existing.some((item) => item.url === url);

    if (alreadyExists) {
      return response(200, {
        success: true,
        message: "URL already exists.",
        duplicate: true
      });
    }

    existing.push({
      url,
      date: new Date().toISOString()
    });

    await store.setJSON("urls", existing);

    return response(200, {
      success: true,
      message: "URL saved successfully.",
      duplicate: false
    });
  } catch (err) {
    return response(500, { error: err.message || "Server error." });
  }
};

function response(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  };
}