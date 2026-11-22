// Makes one mp3 file for every phrase and language.
//
// Dry run (default): prints the number of characters and does not call the API.
//   npm run audio
// Real run: calls ElevenLabs and saves mp3 files in public/audio.
//   npm run audio:run
//
// Files that already exist are skipped, so you never pay twice.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { readFileSync } from "node:fs";
import path from "node:path";

const API_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";

const AUDIO_DIR = path.join(process.cwd(), "public", "audio");
const DATA_FILE = path.join(process.cwd(), "data", "phrases.json");

type Data = {
  languages: { slug: string; name: string; code: string }[];
  phrases: { slug: string; translations: Record<string, string> }[];
};

const isRealRun = process.argv.includes("--run");
const data: Data = JSON.parse(readFileSync(DATA_FILE, "utf-8"));

const jobs = data.phrases.flatMap((phrase) =>
  data.languages.map((language) => ({
    fileName: `${phrase.slug}-${language.slug}.mp3`,
    text: phrase.translations[language.slug],
  })),
);

const missing = jobs.filter((job) => !existsSync(path.join(AUDIO_DIR, job.fileName)));
const characters = missing.reduce((sum, job) => sum + job.text.length, 0);

console.log(`Files in total: ${jobs.length}`);
console.log(`Files already made: ${jobs.length - missing.length}`);
console.log(`Files to make: ${missing.length}`);
console.log(`Characters to send (about the same number of credits): ${characters}`);

if (!isRealRun) {
  console.log("\nDry run only. Nothing was sent. Use --run to make the audio.");
  process.exit(0);
}

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error("Missing ELEVENLABS_API_KEY in .env.local");
  process.exit(1);
}

mkdirSync(AUDIO_DIR, { recursive: true });

for (const job of missing) {
  const response = await fetch(`${API_URL}/${VOICE_ID}?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ text: job.text, model_id: MODEL_ID }),
  });

  if (!response.ok) {
    // Stop at the first error so we do not waste credits.
    console.error(`Failed for ${job.fileName}: ${response.status}`);
    console.error(await response.text());
    process.exit(1);
  }

  const audio = Buffer.from(await response.arrayBuffer());
  writeFileSync(path.join(AUDIO_DIR, job.fileName), audio);
  console.log(`Saved ${job.fileName}`);
}

console.log("Done.");
