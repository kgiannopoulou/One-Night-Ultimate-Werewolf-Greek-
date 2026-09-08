# Λύκοι μια Νύχτα (One Night Ultimate Werewolf, in Greek)

A pass-and-play companion app for the party game **One Night Ultimate Werewolf**,
with a Greek narrator that runs the night phase for you.

## Running it on your iPhone (no Mac needed)

1. Install **Expo Go** from the App Store on your iPhone.
2. On this computer, in this folder, run:
   ```
   npx expo start
   ```
3. Scan the QR code that appears with your iPhone's Camera app — it opens
   directly in Expo Go.

Your phone and computer need to be on the same Wi-Fi network. If they aren't
(e.g. you're on a different network), run `npx expo start --tunnel` instead
(slower, but works over the internet).

## How to play

1. **Νέο Παιχνίδι** → add all your friends' names (they'll take turns holding
   the one phone).
2. **Ρόλοι** → pick which role cards are in play (a recommended set is
   filled in for you; must total players + 3).
3. **Αποκάλυψη Ρόλου** → pass the phone around once so everyone privately
   sees their starting role.
4. **Νύχτα** → the Greek narrator walks through the whole night phase out
   loud. When a role needs to actually do something (Seer, Robber,
   Troublemaker, Drunk, Insomniac, or a lone Werewolf), the app tells you
   who to pass the phone to and shows that player their private options.
5. **Μέρα** → discuss, then pass the phone around once more so everyone
   votes.
6. **Αποτελέσματα** → see who was voted out, everyone's final role, and who
   won.

## The narrator voice

By default the narrator uses the iPhone's built-in Greek text-to-speech,
pitched and slowed down for a "deep narrator" effect
(`src/narrator/Narrator.ts`). It works offline, out of the box, no setup.

If you'd rather have a proper AI-generated deep voice actor instead of the
system voice, see `scripts/generate-voice.md` — it's a short script that
generates real audio clips for all the narrator's lines once, which then get
bundled into the app.

**Note:** iOS mutes app audio when the phone's physical silent switch is on
— flip it to ring mode before playing.

## Publishing a real installable build later

This uses [Expo](https://expo.dev), so when you're ready to install it as a
normal app (not through Expo Go) or submit it to the App Store, you can run
an iOS build entirely in the cloud with [EAS Build](https://docs.expo.dev/build/introduction/) —
still no Mac required. That does need a (free to start) Expo account, and a
paid Apple Developer account ($99/year) only if you want it on the App
Store; installing it on just your friends' phones via TestFlight is
possible without a store listing.
