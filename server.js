import express, { json, static as serveStatic } from "express";
import { writeFile } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000;

app.use(cors()); // Enable CORS
app.use(json());
app.use(serveStatic(join(__dirname, "public")));

app.post("/save-window-config", (req, res) => {
  const config = req.body;
  writeFile(
    join(__dirname, "public", "window-config.json"),
    JSON.stringify(config, null, 2),
    (err) => {
      if (err) {
        console.error("Error saving window configuration:", err);
        return res.status(500).send("Error saving window configuration");
      }
      res.send("Window configuration saved successfully");
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
