import type { BearData } from "~/types";
import { RESUME_URL } from "~/utils/constants";

const bear: BearData[] = [
  {
    id: "profile",
    title: "Profile",
    icon: "i-fa-solid:paw",
    md: [
      {
        id: "about-me",
        title: "About Me",
        file: "markdown/about-me.md",
        icon: "i-la:dragon",
        excerpt: "DevOps Cloud Engineer"
      },
      {
        id: "github-stats",
        title: "Github Stats",
        file: "https://raw.githubusercontent.com/chu0jz013/chu0jz013/main/README.md",
        icon: "i-icon-park-outline:github",
        excerpt: "Here are some status about my github account..."
      },
      {
        id: "about-site",
        title: "About This Site",
        file: "markdown/about-site.md",
        icon: "i-octicon:browser",
        excerpt: "Something about this personal portfolio site..."
      }
    ]
  },
  {
    id: "project",
    title: "Projects",
    icon: "i-octicon:repo",
    md: [
      {
        id: "i-will-update-soon",
        title: "I will update soon",
        file: "markdown/i-will-update-soon.md",
        icon: "i-icon-park-outline:github",
        excerpt: "I will update soon... "
      }
    ]
  },
  {
    id: "resume",
    title: "Resume",
    icon: "i-octicon:file",
    md: [
      {
        id: "resume",
        title: "Resume",
        file: "markdown/resume.md",
        icon: "i-ri:gamepad-line",
        excerpt: "My resume",
        link: RESUME_URL
      }
    ]
  }
];

export default bear;
