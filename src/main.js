import fs from "fs";
import config from "../config.js";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "../output");

async function main() {
  const data = JSON.parse(fs.readFileSync(config.data, "utf-8"));

  const transformedData =
    config.replacer && config.replacer.on !== false
      ? data.map((item) => {
          const transformedItem = {};

          for (const [key, value] of Object.entries(config.replacer.columns)) {
            transformedItem[value] = item[key] || "";
          }

          for (const [key, value] of Object.entries(config.replacer.values)) {
            if (typeof value === "object") {
              transformedItem[key] =
                value[transformedItem[key]] || transformedItem[key] || "";
            } else {
              transformedItem[key] = value;
            }
          }

          return transformedItem;
        })
      : data;

  const sentData = [];
  const failedData = [];

  process.on("SIGINT", () => {
    console.log("\nProcess interrupted. Saving progress...");

    fs.mkdirSync(outputDir, { recursive: true });

    fs.writeFileSync(
      path.join(outputDir, "sent_data.json"),
      JSON.stringify(sentData, null, 2),
      "utf-8",
    );

    fs.writeFileSync(
      path.join(outputDir, "failed_data.json"),
      JSON.stringify(failedData, null, 2),
      "utf-8",
    );

    console.log("Progress saved. Exiting.");
    process.exit(0);
  });

  for (let i = 0; i < transformedData.length; i++) {
    const item = transformedData[i];

    try {
      await axios.post(config.api.endpoint, item, {
        headers: config.api.headers,
      });

      console.count("Sent data:");
    } catch (error) {
      failedData.push({ item, error: error.message });

      console.count("Failed data:");
      console.error("Error occurred while sending data:", error.message);
    }
  }

  // Create output directory if it doesn't exist
  fs.mkdirSync(outputDir, { recursive: true });

  fs.writeFileSync(
    path.join(outputDir, "sent_data.json"),
    JSON.stringify(sentData, null, 2),
    "utf-8",
  );

  fs.writeFileSync(
    path.join(outputDir, "failed_data.json"),
    JSON.stringify(failedData, null, 2),
    "utf-8",
  );
}

main();
