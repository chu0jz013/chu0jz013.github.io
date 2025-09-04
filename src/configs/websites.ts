import type { WebsitesData } from "~/types";
import { WEBSITE_URL } from "~/utils/constants";

const websites: WebsitesData = {
  favorites: {
    title: "My Links",
    sites: [
      {
        id: "my-website",
        title: "Website",
        img: "img/sites/astral.svg",
        link: `${WEBSITE_URL}/old`,
        inner: true
      },
      {
        id: "my-github",
        title: "Github",
        img: "img/sites/github.svg",
        link: "https://github.com/chu0jz013"
      },
      {
        id: "my-linkedin",
        title: "Linkedin",
        img: "img/sites/linkedin.svg",
        link: "https://www.linkedin.com/in/williamkieuu"
      },
      {
        id: "my-email",
        title: "Email",
        img: "img/sites/gmail.svg",
        link: "mailto:williamkieu-devops@outlook.com"
      }
    ]
  },
  freq: {
    title: "Frequently Visited",
    sites: [
      {
        id: "github",
        title: "Github",
        img: "img/sites/github.svg",
        link: "https://github.com/"
      },
      {
        id: "twitter",
        title: "Twitter",
        img: "img/sites/twitter.svg",
        link: "https://www.twitter.com/"
      },
      {
        id: "leetcode",
        title: "LeetCode",
        img: "img/sites/leetcode.svg",
        link: "https://leetcode.com/"
      },
      {
        id: "reddit",
        title: "Reddit",
        img: "img/sites/reddit.svg",
        link: "https://www.reddit.com/"
      },
      {
        id: "steam",
        title: "Steam",
        img: "img/sites/steam.svg",
        link: "https://store.steampowered.com/"
      },
      {
        id: "aws",
        title: "AWS",
        img: "old/images/amazon.png",
        link: "https://console.aws.amazon.com/"
      },
      {
        id: "gcp",
        title: "GCP",
        img: "old/images/gcp.png",
        link: "https://console.cloud.google.com/"
      },
      {
        id: "azure",
        title: "Azure",
        img: "https://azure.microsoft.com/favicon.ico",
        link: "https://portal.azure.com/"
      },
      {
        id: "kubernetes",
        title: "Kubernetes",
        img: "old/images/k8s.png",
        link: "https://kubernetes.io/"
      },
      {
        id: "docker",
        title: "Docker",
        img: "old/images/docker.png",
        link: "https://www.docker.com/"
      },
      {
        id: "jenkins",
        title: "Jenkins",
        img: "old/images/jenkins.png",
        link: "https://www.jenkins.io/"
      }
    ]
  }
};

export default websites;
