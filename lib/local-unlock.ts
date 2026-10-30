/** Local development only: WORKCV_LOCAL_UNLOCK=1 lets you download your own CVs without paying,
 * to test the PDF and Word files. Production builds ignore it, so it can never unlock the live site. */
export function localUnlockEnabled(environment: Record<string, string | undefined> = process.env) {
  return environment.NODE_ENV !== "production" && environment.WORKCV_LOCAL_UNLOCK === "1";
}
