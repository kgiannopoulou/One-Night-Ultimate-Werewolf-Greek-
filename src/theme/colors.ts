export const colors = {
  bg: "#0b0f1a",
  bgAlt: "#131a2a",
  card: "#1c2540",
  cardBorder: "#334066",
  accent: "#e0553f", // blood moon red
  accentAlt: "#f2a53c", // moon glow
  text: "#f5f3ee",
  textDim: "#a9b0c6",
  werewolf: "#c0392b",
  village: "#3b7a57",
  tanner: "#8e5a9e",
  danger: "#c0392b",
};

export const typography = {
  title: { fontSize: 30, fontWeight: "800" as const, color: colors.text },
  h2: { fontSize: 22, fontWeight: "700" as const, color: colors.text },
  body: { fontSize: 16, fontWeight: "400" as const, color: colors.text },
  dim: { fontSize: 14, fontWeight: "400" as const, color: colors.textDim },
};
