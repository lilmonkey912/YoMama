import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";

export enum MeanLevel {
  LOW,
  MEDIUM_LOW,
  MEDIUM,
  MEDIUM_HIGH,
  HIGH,
}

export type WindowTitleRelevanceCache = Record<string, boolean>;

const BASE_PATH = path.join(__dirname, "..", "..", "data");

try {
  mkdirSync(BASE_PATH, { recursive: true });
} catch {}

export class DataStore {
  getUser(): string | null {
    const p = path.join(BASE_PATH, "user.json");
    if (!existsSync(p)) {
      return null;
    }
    try {
      return JSON.parse(readFileSync(p, "utf8"));
    } catch {
      return null;
    }
  }

  setUser(user: string) {
    const p = path.join(BASE_PATH, "user.json");
    writeFileSync(p, JSON.stringify(user, null, 2));
  }

  getFocusTarget(): string | null {
    const p = path.join(BASE_PATH, "focus_target.json");
    if (!existsSync(p)) {
      return null;
    }
    return JSON.parse(readFileSync(p, "utf8"));
  }

  setFocusTarget(focusTarget: string) {
    const p = path.join(BASE_PATH, "focus_target.json");
    writeFileSync(p, JSON.stringify(focusTarget, null, 2));
  }

  getAppOverrides(): string[] {
    const p = path.join(BASE_PATH, "app_overrides.json");
    try {
      return JSON.parse(readFileSync(p, "utf8"));
    } catch {
      return [];
    }
  }

  setAppOverrides(appIds: string[]) {
    const p = path.join(BASE_PATH, "app_overrides.json");
    writeFileSync(p, JSON.stringify(appIds, null, 2));
  }

  getMeanLevel(): number {
    const p = path.join(BASE_PATH, "mean_level.json");
    try {
      return JSON.parse(readFileSync(p, "utf8"));
    } catch {
      return 0;
    }
  }

  setMeanLevel(meanLevel: number) {
    const p = path.join(BASE_PATH, "mean_level.json");
    writeFileSync(p, JSON.stringify(meanLevel, null, 2));
  }

  getMeanLevelOverride(): MeanLevel | null {
    const p = path.join(BASE_PATH, "mean_level_override.json");
    try {
      return JSON.parse(readFileSync(p, "utf8"));
    } catch {
      return null;
    }
  }

  setMeanLevelOverride(meanLevel: MeanLevel) {
    const p = path.join(BASE_PATH, "mean_level_override.json");
    writeFileSync(p, JSON.stringify(meanLevel, null, 2));
  }

  getWindowTitleRelevanceCache(): WindowTitleRelevanceCache {
    const p = path.join(BASE_PATH, "window_title_relevance_cache.json");
    try {
      return JSON.parse(readFileSync(p, "utf8"));
    } catch {
      return {};
    }
  }

  setWindowTitleRelevanceCache(cache: WindowTitleRelevanceCache) {
    const p = path.join(BASE_PATH, "window_title_relevance_cache.json");
    writeFileSync(p, JSON.stringify(cache, null, 2));
  }
}

export const dataStore = new DataStore();
