# Generating a real deep-voice Greek narrator

The app already works with the iPhone's built-in Greek text-to-speech
(pitched down for a "deep narrator" effect). This is how to replace it with
a proper AI-generated voice actor instead, using [ElevenLabs](https://elevenlabs.io).

## 1. Get an API key + pick a voice

1. Sign up at elevenlabs.io (there's a free tier with limited monthly
   characters — plenty for these ~19 short lines).
2. Go to **Voices** → find a deep male voice you like. Their [Greek voice
   library](https://elevenlabs.io/text-to-speech/greek) is a good starting
   point, or use their voice-design tool to make one from a text
   description ("deep, dramatic, ominous male narrator").
3. Open that voice's page and copy its **Voice ID**.
4. Go to your account settings and copy your **API key**.

## 2. Run the generator

From this project's folder:

```
ELEVENLABS_API_KEY=your_key_here ELEVENLABS_VOICE_ID=your_voice_id_here node scripts/generate-voice.mjs
```

(On Windows PowerShell:
`$env:ELEVENLABS_API_KEY="your_key"; $env:ELEVENLABS_VOICE_ID="your_voice_id"; node scripts/generate-voice.mjs`)

This creates one `.mp3` per narrator line under `assets/audio/el/`.

## 3. Wire the files in

Open `src/narrator/audioMap.ts` and uncomment (or add) an entry for each
generated file, e.g.:

```ts
export const AUDIO_MAP: Record<string, number> = {
  intro: require("../../assets/audio/el/intro.mp3"),
  outro: require("../../assets/audio/el/outro.mp3"),
  werewolf_wake: require("../../assets/audio/el/werewolf_wake.mp3"),
  werewolf_sleep: require("../../assets/audio/el/werewolf_sleep.mp3"),
  minion_wake: require("../../assets/audio/el/minion_wake.mp3"),
  minion_sleep: require("../../assets/audio/el/minion_sleep.mp3"),
  mason_wake: require("../../assets/audio/el/mason_wake.mp3"),
  mason_sleep: require("../../assets/audio/el/mason_sleep.mp3"),
  seer_wake: require("../../assets/audio/el/seer_wake.mp3"),
  seer_sleep: require("../../assets/audio/el/seer_sleep.mp3"),
  robber_wake: require("../../assets/audio/el/robber_wake.mp3"),
  robber_sleep: require("../../assets/audio/el/robber_sleep.mp3"),
  troublemaker_wake: require("../../assets/audio/el/troublemaker_wake.mp3"),
  troublemaker_sleep: require("../../assets/audio/el/troublemaker_sleep.mp3"),
  drunk_wake: require("../../assets/audio/el/drunk_wake.mp3"),
  drunk_sleep: require("../../assets/audio/el/drunk_sleep.mp3"),
  insomniac_wake: require("../../assets/audio/el/insomniac_wake.mp3"),
  insomniac_sleep: require("../../assets/audio/el/insomniac_sleep.mp3"),
};
```

Restart the Expo dev server (`npx expo start -c` to clear the bundler
cache) and the narrator will play these recordings instead of the system
voice — no other code changes needed.

Any key you *don't* add a file for just keeps using the phone's TTS as a
fallback, so you can do this gradually.
