import "dotenv/config";
import * as deepl from "deepl-node";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const translator = new deepl.Translator(process.env.DEEPL_API_KEY);

const targetLocales = {
  en: "EN-US",
  ru: "RU",
  de: "DE",
  es: "ES",
  uk: "UK",
  pl: "PL",
};

const messagesDir = path.join(__dirname, "../i18n/messages");

async function translateObject(obj, targetLang) {
  // اجمع كل الـ (path, text) في array واحد
  const entries = [];
  function collect(o, prefix = []) {
    for (const key in o) {
      if (typeof o[key] === "string") {
        entries.push({ path: [...prefix, key], text: o[key] });
      } else if (typeof o[key] === "object") {
        collect(o[key], [...prefix, key]);
      }
    }
  }
  collect(obj);

  // ترجمة كل النصوص في استدعاء واحد
  const texts = entries.map((e) => e.text);
  const results = await translator.translateText(texts, "ar", targetLang);

  // إعادة بناء الـ object الأصلي
  const output = {};
  entries.forEach((entry, i) => {
    let current = output;
    for (let j = 0; j < entry.path.length - 1; j++) {
      current[entry.path[j]] = current[entry.path[j]] || {};
      current = current[entry.path[j]];
    }
    current[entry.path[entry.path.length - 1]] = results[i].text;
  });

  return output;
}

async function main() {
  const source = JSON.parse(
    fs.readFileSync(path.join(messagesDir, "ar.json"), "utf-8"),
  );

  for (const [locale, deeplCode] of Object.entries(targetLocales)) {
    console.log(`Translating to ${locale}...`);
    const translated = await translateObject(source, deeplCode);
    fs.writeFileSync(
      path.join(messagesDir, `${locale}.json`),
      JSON.stringify(translated, null, 2),
      "utf-8",
    );
  }
  console.log("Done!");
}

main();
