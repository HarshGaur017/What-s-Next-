const COLORS = {
  primaryGradientStart: "#C7B6F5",
  primaryGradientEnd: "#A88FE8",

  yellowBubble: "#F5D87A",
  peachBubble: "#F6C6A8",
  mintBubble: "#AEE3D4",

  background: "#FFFFFF",
  card: "#F6F6F8",

  textPrimary: "#1E1E1E",
  textSecondary: "#6E6E73",

  black: "#000000",
  white: "#FFFFFF",

  // --- ADDED COLORS ---
  buttonPurple: "#B895F6",       // Solid purple for "Continue" / "Start Task" buttons
  cardPurpleLight: "#E4D4FA",    // Background for "Your Next Action" card
  successGreen: "#74D09C",       // Green for the checkmarks
  successGreenLight: "#E4F6EB",  // Light green background circle behind checkmarks
  darkSurface: "#212124",        // Dark round button on the first screen
  iconGray: "#A3A3A8",           // Lighter gray for back arrows and "+" icons
};

const FONT = {
  fontFamily: {
    regular: "System",
    medium: "System",
    bold: "System",
  },

  fontSize: {
    xxs: 10, // ADDED: For tiny timestamps like "30 min" on the right side of the progress list
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },

  fontWeight: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

const RADIUS = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 999,
};

export const theme = {
  COLORS,
  FONT,
  SPACING,
  RADIUS,
};