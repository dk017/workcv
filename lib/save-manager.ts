export type SaveStatus = "saved" | "saving" | "unsaved" | "error";

export type SaveSnapshot = {
  status: SaveStatus;
  error: string | null;
  version: number;
};

type SaveResult = { updatedAt: string };

export class SaveConflictError extends Error {
  constructor(message = "This CV was updated in another tab.") {
    super(message);
    this.name = "SaveConflictError";
  }
}

export class DebouncedSaveManager<T> {
  private value: T;
  private revision: string;
  private version = 0;
  private savedVersion = 0;
  private status: SaveStatus = "saved";
  private error: string | null = null;
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
    return { status: this.status, error: this.error, version: this.version };
  }

  setValue(value: T) {
    if (this.disposed) return;
    this.value = value;
    this.version += 1;
    this.status = "unsaved";
    this.error = null;
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
    this.emit();

    const operation = this.save(savingValue, savingRevision, options)
      .then((result) => {
        this.revision = result.updatedAt;
        this.savedVersion = Math.max(this.savedVersion, savingVersion);
        if (this.version === savingVersion) {
          this.status = "saved";
          this.error = null;
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
