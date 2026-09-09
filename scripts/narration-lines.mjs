// Single source of truth for narrator line keys + Greek text, shared by the
// voice-generation script. Keep this in sync with src/game/nightScript.ts
// and src/game/dayScript.ts — if you edit the wording there, copy the
// change here too before regenerating audio.

export const LINES = [
  { key: "intro", text: "Κλείστε όλοι τα μάτια σας." },
  {
    key: "outro",
    text: "Ο ήλιος ανατέλλει. Ξυπνήστε όλοι! Συζητήστε μεταξύ σας ποιος πιστεύετε ότι είναι Λύκος, και μετά ψηφίστε.",
  },
  {
    key: "werewolf_wake",
    text: "Λύκοι, ξυπνήστε και δείτε ποιοι άλλοι είναι Λύκοι. Αν είστε μόνος σας Λύκος, μπορείτε να κοιτάξετε μία κάρτα από το κέντρο.",
  },
  { key: "werewolf_sleep", text: "Λύκοι, κλείστε τα μάτια σας και βγάλτε τη γροθιά σας έξω." },
  {
    key: "minion_wake",
    text: "Τσιράκι, ξύπνα και δες ποιος έχει τη γροθιά έξω — αυτοί είναι οι Λύκοι.",
  },
  { key: "minion_sleep", text: "Τσιράκι, κλείσε τα μάτια σου. Λύκοι, μαζέψτε τη γροθιά σας." },
  { key: "mason_wake", text: "Μασόνοι, ξυπνήστε και δείτε ποιος άλλος είναι Μασόνος." },
  { key: "mason_sleep", text: "Μασόνοι, κλείστε τα μάτια σας." },
  {
    key: "seer_wake",
    text: "Μάντισσα, ξύπνα. Μπορείς να δεις την κάρτα ενός άλλου παίκτη, ή δύο κάρτες από το κέντρο.",
  },
  { key: "seer_sleep", text: "Μάντισσα, κλείσε τα μάτια σου." },
  {
    key: "robber_wake",
    text: "Κλέφτη, ξύπνα. Μπορείς να ανταλλάξεις την κάρτα σου με την κάρτα ενός άλλου παίκτη, και μετά να δεις τη νέα σου κάρτα.",
  },
  { key: "robber_sleep", text: "Κλέφτη, κλείσε τα μάτια σου." },
  {
    key: "troublemaker_wake",
    text: "Ταραξία, ξύπνα. Μπορείς να ανταλλάξεις τις κάρτες δύο άλλων παικτών, χωρίς να τις δεις.",
  },
  { key: "troublemaker_sleep", text: "Ταραξία, κλείσε τα μάτια σου." },
  {
    key: "drunk_wake",
    text: "Μεθύστακα, ξύπνα. Αντάλλαξε την κάρτα σου με μία κάρτα από το κέντρο, χωρίς να τη δεις.",
  },
  { key: "drunk_sleep", text: "Μεθύστακα, κλείσε τα μάτια σου." },
  {
    key: "insomniac_wake",
    text: "Ξάγρυπνε, ξύπνα και δες την κάρτα σου, για να δεις αν άλλαξε.",
  },
  { key: "insomniac_sleep", text: "Ξάγρυπνε, κλείσε τα μάτια σου." },
  { key: "day_warning_60", text: "Απομένει ένα λεπτό!" },
  { key: "day_warning_30", text: "Απομένουν τριάντα δευτερόλεπτα!" },
  {
    key: "day_time_up",
    text: "Ο χρόνος τελείωσε! Όλοι μαζί: τρία, δύο, ένα... Ψηφίστε!",
  },
];
