export type SaveStatus = "saved" | "saving" | "unsaved" | "error";

export type SaveSnapshot = {
  status: SaveStatus;
  error: string | null;
  errorKind: "conflict" | "invalid" | "general" | null;
  /** Field for an invalid save, or "network" / "http_<status>"; safe for analytics. */
  errorDetail: string | null;
  version: number;
};

type SaveResult = { updatedAt: string };

export class SaveConflictError extends Error {
  constructor(message = "This CV was updated in another tab.") {
    super(message);
    this.name = "SaveConflictError";
  }
}

/** The data would be rejected, so retrying cannot help until the field is changed. */
export class SaveValidationError extends Error {
  readonly field: string;

  constructor(message: string, field: string) {
    super(message);
    this.name = "SaveValidationError";
    this.field = field;
  }
}

/** The request failed: status 0 when the server could not be reached. */
export class SaveRequestError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "SaveRequestError";
    this.status = status;
  }
}

function errorKindFor(error: unknown): SaveSnapshot["errorKind"] {
  if (error instanceof SaveConflictError) return "conflict";
  if (error instanceof SaveValidationError) return "invalid";
  return "general";
}

function errorDetailFor(error: unknown) {
  if (error instanceof SaveValidationError) return error.field;
  if (error instanceof SaveRequestError) return error.status === 0 ? "network" : `http_${error.status}`;
  return null;
}

export class DebouncedSaveManager<T> {
  private value: T;
  private revision: string;
  private version = 0;
  private savedVersion = 0;
  private status: SaveStatus = "saved";
  private error: string | null = null;
  private errorKind: SaveSnapshot["errorKind"] = null;
  private errorDetail: string | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private activeSave: Promise<boolean> | null = null;
  private disposed = false;
  private listeners = new Set<(snapshot: SaveSnapshot) => void>();
  private readonly save: (
    value: T,
    expectedUpdatedAt: string,
    options?: { keepalive?: boolean },
  ) => Promise<SaveResult>;
  private readonly debounceMs: number;

  constructor(
    initialValue: T,
    initialRevision: string,
    save: (
      value: T,
      expectedUpdatedAt: string,
      options?: { keepalive?: boolean },
    ) => Promise<SaveResult>,
    debounceMs = 650,
  ) {
    this.value = initialValue;
    this.revision = initialRevision;
    this.save = save;
    this.debounceMs = debounceMs;
  }

  subscribe(listener: (snapshot: SaveSnapshot) => void) {
    this.listeners.add(listener);
    listener(this.snapshot());
    return () => this.listeners.delete(listener);
  }

  snapshot(): SaveSnapshot {
    return {
      status: this.status,
      error: this.error,
      errorKind: this.errorKind,
      errorDetail: this.errorDetail,
      version: this.version,
    };
  }

  setValue(value: T) {
    if (this.disposed) return;
    this.value = value;
    this.version += 1;
    this.status = "unsaved";
    this.error = null;
    this.errorKind = null;
    this.errorDetail = null;
    this.emit();
    this.schedule();
  }

  hasUnsavedChanges() {
    return this.savedVersion !== this.version || this.status === "error";
  }

  async flush(options?: { keepalive?: boolean }): Promise<boolean> {
    if (this.disposed || !this.hasUnsavedChanges()) return this.status !== "error";
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.activeSave) {
      await this.activeSave;
      if (!this.hasUnsavedChanges()) return this.status !== "error";
    }

    const savingVersion = this.version;
    const savingValue = this.value;
    const savingRevision = this.revision;
    this.status = "saving";
    this.error = null;
    this.errorKind = null;
    this.errorDetail = null;
    this.emit();

    const operation = this.save(savingValue, savingRevision, options)
      .then((result) => {
        this.revision = result.updatedAt;
        this.savedVersion = Math.max(this.savedVersion, savingVersion);
        if (this.version === savingVersion) {
          this.status = "saved";
          this.error = null;
          this.errorKind = null;
          this.errorDetail = null;
        } else {
          this.status = "unsaved";
          this.schedule();
        }
        this.emit();
        return true;
      })
      .catch((error: unknown) => {
        this.status = "error";
        this.error =
          error instanceof Error ? error.message : "Your changes could not be saved.";
        this.errorKind = errorKindFor(error);
        this.errorDetail = errorDetailFor(error);
        this.emit();
        return false;
      })
      .finally(() => {
        this.activeSave = null;
      });

    this.activeSave = operation;
    return operation;
  }

  retry() {
    return this.flush();
  }

  dispose() {
    this.disposed = true;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.listeners.clear();
  }

  private schedule() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.timer = null;
      void this.flush();
    }, this.debounceMs);
  }

  private emit() {
    const snapshot = this.snapshot();
    this.listeners.forEach((listener) => listener(snapshot));
  }
}
