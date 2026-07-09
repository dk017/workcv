const controlCharacterPattern = /[\u0000-\u001f\u007f]/;

export function safeInternalRedirect(value: unknown, fallback = "/editor") {
  if (typeof value !== "string" || value.length === 0 || value.length > 2_000) {
    return fallback;
  }
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    controlCharacterPattern.test(value)
  ) {
    return fallback;
  }

  let decoded = value;
  try {
    for (let index = 0; index < 2; index += 1) {
      const next = decodeURIComponent(decoded);
      if (next === decoded) break;
      decoded = next;
    }
  } catch {
    return fallback;
  }

  if (
    !decoded.startsWith("/") ||
    decoded.startsWith("//") ||
    decoded.includes("\\") ||
    controlCharacterPattern.test(decoded)
  ) {
    return fallback;
  }

  try {
    const parsed = new URL(value, "https://workcv.invalid");
    if (parsed.origin !== "https://workcv.invalid") return fallback;
  } catch {
    return fallback;
  }

  return value;
}
