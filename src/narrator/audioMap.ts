// Maps a narration line key to a bundled audio file.
// Metro requires static `require()` calls, so each clip must be listed here
// by hand once it exists — see scripts/generate-voice.md for how to
// generate the actual Greek voice-actor audio files.
//
// Once a key has a file here, the narrator plays that recording instead of
// falling back to the phone's built-in text-to-speech. Nothing else in the
// app needs to change.
//
// Example, once assets/audio/el/intro.mp3 exists:
//   intro: require("../../assets/audio/el/intro.mp3"),

export const AUDIO_MAP: Record<string, number> = {
  // intro: require("../../assets/audio/el/intro.mp3"),
  // outro: require("../../assets/audio/el/outro.mp3"),
  // werewolf_wake: require("../../assets/audio/el/werewolf_wake.mp3"),
  // werewolf_sleep: require("../../assets/audio/el/werewolf_sleep.mp3"),
};
