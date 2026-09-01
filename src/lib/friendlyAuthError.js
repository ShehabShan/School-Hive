export const friendlyAuthError = (raw) => {
  const m = String(raw || "").toLowerCase();
  if (
    m.includes("wrong-password") ||
    m.includes("invalid-credential") ||
    m.includes("user-not-found") ||
    m.includes("invalid-login")
  ) {
    return "Incorrect email or password. Please try again.";
  }
  if (m.includes("too-many-requests")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (m.includes("network") || m.includes("unavailable")) {
    return "Network error. Check your connection and try again.";
  }
  if (m.includes("invalid-email")) {
    return "Please enter a valid email address.";
  }
  if (m.includes("user-disabled")) {
    return "This account has been disabled.";
  }
  if (m.includes("email-already-in-use")) {
    return "An account with this email already exists. Sign in instead.";
  }
  if (m.includes("weak-password")) {
    return "Password should be at least 6 characters.";
  }
  if (m.includes("operation-not-allowed")) {
    return "This sign-in method is not enabled.";
  }
  return String(raw || "Something went wrong. Please try again.");
};