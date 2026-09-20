const STORAGE_KEY = "has-booted";

// Only a first-time visitor watches the machine start up. After that the flag
// below sends them straight to the login screen, the way a real Mac only cold
// boots once and then just wakes.
export const hasBooted = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    // storage blocked (private mode): boot every time rather than crash
    return false;
  }
};

export const markBooted = (): void => {
  try {
    localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // storage blocked: the boot screen simply shows again next visit
  }
};
