import * as Speech from "expo-speech";
import { createAudioPlayer, AudioPlayer } from "expo-audio";
import { AUDIO_MAP } from "./audioMap";

// Deep, slow, dramatic narrator voice using the phone's built-in Greek TTS.
// Falls back on this whenever no bundled recording exists for a line yet.
const NARRATOR_OPTIONS: Speech.SpeechOptions = {
  language: "el-GR",
  pitch: 0.72, // lower pitch = deeper voice
  rate: 0.86, // slightly slower = more dramatic
};

// If the platform's TTS/audio never calls back (unsupported voice, browser
// quirk, etc.) we still want the game to move on rather than hang forever.
const SAFETY_TIMEOUT_MS = 12000;

let activePlayer: AudioPlayer | null = null;
let currentResolve: (() => void) | null = null;

function resolveOnce(resolve: () => void) {
  return () => {
    if (currentResolve === resolve) currentResolve = null;
    resolve();
  };
}

function speakWithTTS(text: string): Promise<void> {
  return new Promise((resolve) => {
    const done = resolveOnce(resolve);
    currentResolve = resolve;
    const timer = setTimeout(done, SAFETY_TIMEOUT_MS);
    try {
      Speech.speak(text, {
        ...NARRATOR_OPTIONS,
        onDone: () => {
          clearTimeout(timer);
          done();
        },
        onStopped: () => {
          clearTimeout(timer);
          done();
        },
        onError: () => {
          clearTimeout(timer);
          done();
        },
      });
    } catch (e) {
      console.warn("Narrator TTS failed, continuing silently:", e);
      clearTimeout(timer);
      done();
    }
  });
}

function playAudioFile(source: number): Promise<void> {
  return new Promise((resolve) => {
    const done = resolveOnce(resolve);
    currentResolve = resolve;
    const timer = setTimeout(done, SAFETY_TIMEOUT_MS);
    try {
      const player = createAudioPlayer(source);
      activePlayer = player;
      const sub = player.addListener("playbackStatusUpdate", (status) => {
        if (status.didJustFinish) {
          clearTimeout(timer);
          sub.remove();
          player.remove();
          if (activePlayer === player) activePlayer = null;
          done();
        }
      });
      player.play();
    } catch (e) {
      console.warn("Narrator audio playback failed, continuing silently:", e);
      clearTimeout(timer);
      done();
    }
  });
}

/**
 * Speaks a narration line. `key` looks up a bundled recording in AUDIO_MAP;
 * if none exists yet, `fallbackText` is read aloud with the device's Greek
 * text-to-speech instead. Never throws / never hangs forever — any TTS or
 * audio failure is swallowed so it can't freeze the game.
 */
export function speakLine(key: string, fallbackText: string): Promise<void> {
  stop();
  const audioSource = AUDIO_MAP[key];
  return audioSource ? playAudioFile(audioSource) : speakWithTTS(fallbackText);
}

/** Speaks raw text with the device TTS, bypassing the audio-file map. */
export function speak(text: string): Promise<void> {
  stop();
  return speakWithTTS(text);
}

export function stop() {
  try {
    Speech.stop();
  } catch {}
  if (activePlayer) {
    try {
      activePlayer.remove();
    } catch {}
    activePlayer = null;
  }
  currentResolve = null;
}
