import React from "react";
import { createRoot } from "react-dom/client";

import Desktop from "~/pages/Desktop";
import Login from "~/pages/Login";
import Boot from "~/pages/Boot";
import OldPortfolio from "~/components/apps/OldPortfolio";
import { deepLinkApp } from "~/utils";

import "@unocss/reset/tailwind.css";
import "uno.css";
import "katex/dist/katex.min.css";
import "~/styles/index.css";

export default function App() {
  // a deep link such as /happy-farm goes straight into the app it names; the
  // login screen is cosmetic (the configured password is empty), so skipping it
  // bypasses nothing
  const [login, setLogin] = useState<boolean>(deepLinkApp() !== null);
  const [booting, setBooting] = useState<boolean>(false);
  const [restart, setRestart] = useState<boolean>(false);
  const [sleep, setSleep] = useState<boolean>(false);

  // GitHub Pages' 404.html bounces /happy-farm here as /?p=/happy-farm; put the
  // pretty path back in the address bar
  useEffect(() => {
    const bounced = new URLSearchParams(window.location.search).get("p");
    if (bounced && bounced.startsWith("/") && !bounced.startsWith("//"))
      history.replaceState(null, "", bounced);
  }, []);

  // Serve legacy portfolio at /old via iframe component
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/old")) {
    return <OldPortfolio />;
  }

  const shutMac = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setRestart(false);
    setSleep(false);
    setLogin(false);
    setBooting(true);
  };

  const restartMac = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setRestart(true);
    setSleep(false);
    setLogin(false);
    setBooting(true);
  };

  const sleepMac = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setRestart(false);
    setSleep(true);
    setLogin(false);
    setBooting(true);
  };

  if (booting) {
    return <Boot restart={restart} sleep={sleep} setBooting={setBooting} />;
  } else if (login) {
    return (
      <Desktop
        setLogin={setLogin}
        shutMac={shutMac}
        sleepMac={sleepMac}
        restartMac={restartMac}
      />
    );
  } else {
    return (
      <Login
        setLogin={setLogin}
        shutMac={shutMac}
        sleepMac={sleepMac}
        restartMac={restartMac}
      />
    );
  }
}

const rootElement = document.getElementById("root") as HTMLElement;
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
