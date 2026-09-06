import appsRaw from "./apps";
import bear from "./bear";
import farm from "./farm";
import launchpadAppsRaw from "./launchpad";
import music from "./music";
import terminal from "./terminal";
import user from "./user";
import wallpapers from "./wallpapers";
import websites from "./websites";

// Hide entries flagged `disabled: true` from dock, launchpad, and spotlight
const apps = appsRaw.filter((a) => !a.disabled);
const launchpadApps = launchpadAppsRaw.filter((a) => !a.disabled);

export { apps, bear, farm, launchpadApps, music, terminal, user, wallpapers, websites };
