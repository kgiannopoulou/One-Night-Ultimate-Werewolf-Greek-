// Generates deep-voice Greek narrator audio clips via the ElevenLabs API.
// See scripts/generate-voice.md for setup instructions.
//
// Usage:
//   ELEVENLABS_API_KEY=xxx ELEVENLABS_VOICE_ID=yyy node scripts/generate-voice.mjs

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LINES } from "./narration-lines.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "assets", "audio", "el");

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

if (!API_KEY || !VOICE_ID) {
  console.error(
    "Missing ELEVENLABS_API_KEY and/or ELEVENLABS_VOICE_ID environment variables.\n" +
      "See scripts/generate-voice.md for how to get these."
  );
  process.exit(1);
}

async function generateOne({ key, text }) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.8,
          style: 0.35,
        },
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${key}: ${res.status} ${res.statusText} ${body}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const outPath = path.join(OUT_DIR, `${key}.mp3`);
  await writeFile(outPath, buffer);
  console.log(`✓ ${key}.mp3`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  for (const line of LINES) {
    await generateOne(line);
  }
  console.log("\nDone. Now uncomment the matching entries in src/narrator/audioMap.ts");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
