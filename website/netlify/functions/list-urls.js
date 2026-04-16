const { getStore } = require("@netlify/blobs");

exports.handler = async () => {
  try {
    const store = getStore("saved-urls");
    const items = (await store.get("urls", { type: "json" })) || [];

    items.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ items })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ error: err.message || "Server error." })
    };
  }
};