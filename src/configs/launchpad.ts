import type { LaunchpadData } from "~/types";
import { RESUME_AS_CODE_URL } from "~/utils";

const launchpadApps: LaunchpadData[] = [
  {
    id: "old-portfolio",
    title: "Old Portfolio",
    img: "img/icons/launchpad/old-portfolio.png",
    link: "/old/"
  },

  {
    id: "oh-vue-icons",
    title: "Oh, Vue Icons!",
    img: "img/icons/launchpad/oh-vue-icons.png",
    link: "https://oh-vue-icons.js.org",
    disabled: true
  },
  {
    id: "resume",
    title: "Résumé",
    img: "img/icons/launchpad/gungnir.png",
    link: RESUME_AS_CODE_URL
  }
];

export default launchpadApps;
