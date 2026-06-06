import { appBarHeight } from "~/utils";
import { BANANAS_SELLS_URL, RESUME_AS_CODE_URL, THINKPAD_CLUSTER_URL } from "~/utils/constants";
import type { AppsData } from "~/types";

const apps: AppsData[] = [
  {
    id: "launchpad",
    title: "Launchpad",
    desktop: false,
    img: "img/icons/launchpad.png"
  },
  {
    id: "bear",
    title: "Bear",
    desktop: true,
    width: 860 * 1.3,
    height: 500 * 1.5,
    show: true,
    img: "img/icons/bear.png",
    content: <Bear />
  },
  {
    id: "typora",
    title: "Typora",
    desktop: true,
    disabled: true,
    width: 600,
    height: 580,
    y: -20,
    img: "img/icons/typora.png",
    content: <Typora />
  },
  {
    id: "safari",
    title: "Safari",
    desktop: true,
    width: 1024,
    height: 640,
    minWidth: 375,
    minHeight: 200,
    x: -20,
    img: "img/icons/safari.png",
    content: <Safari />
  },
  {
    id: "vscode",
    title: "VSCode",
    desktop: true,
    width: 900,
    height: 600,
    x: 80,
    y: -30,
    img: "img/icons/vscode.png",
    content: <VSCode />
  },
  {
    id: "facetime",
    title: "FaceTime",
    desktop: true,
    img: "img/icons/facetime.png",
    width: 500 * 1.7,
    height: 500 + appBarHeight,
    minWidth: 350 * 1.7,
    minHeight: 350 + appBarHeight,
    aspectRatio: 1.7,
    x: -80,
    y: 20,
    content: <FaceTime />
  },
  {
    id: "terminal",
    title: "Terminal",
    desktop: true,
    width: 960,
    height: 600,
    img: "img/icons/terminal.png",
    content: <Terminal />
  },
  {
    id: "old-portfolio",
    title: "Old Portfolio",
    desktop: true,
    width: 1024,
    height: 640,
    minWidth: 375,
    minHeight: 200,
    x: 200,
    y: 100,
    show: false,
    img: "img/icons/launchpad/old-portfolio.png",
    content: <Safari initialURL="https://williamkieuu-devops.cloud/old" />
  },
  {
    id: "resume-as-code",
    title: "Resume as Code",
    desktop: true,
    width: 1024,
    height: 640,
    minWidth: 375,
    minHeight: 200,
    x: 240,
    y: 140,
    img: "img/icons/launchpad/gungnir.png",
    content: <Safari initialURL={RESUME_AS_CODE_URL} />
  },
  {
    id: "bananas-sells-things",
    title: "Bananas Sells Things",
    desktop: true,
    disabled: true,
    width: 1024,
    height: 640,
    minWidth: 375,
    minHeight: 200,
    x: 280,
    y: 180,
    img: "img/icons/launchpad/meta.png",
    content: <Safari initialURL={BANANAS_SELLS_URL} />
  },
  {
    id: "thinkpad-cluster",
    title: "ThinkPad Cluster",
    desktop: true,
    width: 1024,
    height: 640,
    minWidth: 375,
    minHeight: 200,
    x: 0,
    y: 0,
    img: "img/icons/launchpad/k8s.svg",
    content: <Safari initialURL={THINKPAD_CLUSTER_URL} />
  },
  {
    id: "github",
    title: "Github",
    desktop: false,
    img: "img/icons/github.png",
    link: "https://github.com/chu0jz013/chu0jz013.github.io"
  }
];

export default apps;
