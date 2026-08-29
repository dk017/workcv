const controlCharacterPattern = /[\u0000-\u001f\u007f]/;

export function sanitizeSameOriginPath(value: unknown) {
  if (typeof value !== "string") return null;
  const clean = value
    .trim()
    .replace(controlCharacterPattern, "")
    .slice(0, 500);
  if (!clean || !clean.startsWith("/") || clean.startsWith("//") || clean.includes("\\")) {
    return null;
  }
  try {
    const parsed = new URL(clean, "https://workcv.invalid");
    if (parsed.origin !== "https://workcv.invalid") return null;
    return parsed.pathname;
  } catch {
    return null;
  }
}

export function isPublicMeasurementPath(pathname: string) {
  const path = sanitizeSameOriginPath(pathname);
  if (!path) return false;
  return !(
    path === "/login" ||
    path === "/editor" ||
    path === "/my-cvs" ||
    path.startsWith("/cv-pdf/") ||
    path === "/agent-markdown" ||
    path.startsWith("/api/") ||
    path.startsWith("/chrome/")
  );
}
