import type { LaunchpadData } from "~/types";
import { RESUME_URL } from "~/utils";

const launchpadApps: LaunchpadData[] = [
  {
    id: "old-portfolio",
    title: "Old Portfolio",
    img: "img/icons/old-portfolio.png",
    link: "/old/"
  },

  {
    id: "oh-vue-icons",
    title: "Oh, Vue Icons!",
    img: "img/icons/launchpad/oh-vue-icons.png",
    link: "https://oh-vue-icons.js.org"
  },
  {
    id: "resume",
    title: "Résumé",
    img: "img/icons/launchpad/resume.png",
    link: RESUME_URL
  }
];

export default launchpadApps;
