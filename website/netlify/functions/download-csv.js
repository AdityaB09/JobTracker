const { getStore } = require("@netlify/blobs");

exports.handler = async () => {
  try {
    const store = getStore("saved-urls");
    const items = (await store.get("urls", { type: "json" })) || [];

    const lines = ["url,date"];

    for (const item of items) {
      const url = String(item.url || "").replace(/"/g, '""');
      const date = String(item.date || "").replace(/"/g, '""');
      lines.push(`"${url}","${date}"`);
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="saved_urls.csv"'
      },
      body: lines.join("\n")
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