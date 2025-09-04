import type { TerminalData } from "~/types";
import { WEBSITE_URL } from "~/utils";

const terminal: TerminalData[] = [
  {
    id: "about",
    title: "about",
    type: "folder",
    children: [
      {
        id: "about-bio",
        title: "bio.txt",
        type: "file",
        content: (
          <div className="py-1">
            <div>
              Hi, this is William Kieu. I'm a DevOps Cloud Engineer focused on building
              reliable, secure, and scalable infrastructure on AWS.
            </div>
          </div>
        )
      },
      {
        id: "about-interests",
        title: "interests.txt",
        type: "file",
        content: (
          <ul className="list-disc">
            <li className="ml-4">Hobbies: </li>
            <li className="ml-8">League of Legends </li>
            <li className="ml-8">Poker </li>
            <li className="ml-8">Gaming </li>
            <li className="ml-8">Basketball </li>
          </ul>
        )
      },
      {
        id: "about-who-cares",
        title: "who-cares.txt",
        type: "file",
        content:
          "Open to DevOps/SRE roles and freelance cloud projects. Happy to collaborate."
      },
      {
        id: "about-contact",
        title: "contact.txt",
        type: "file",
        content: (
          <ul className="list-disc ml-6">
            <li>
              Email:{" "}
              <a
                className="text-blue-300"
                href="mailto:williamkieu-devops@outlook.com"
                target="_blank"
                rel="noreferrer"
              >
                williamkieu-devops@outlook.com
              </a>
            </li>
            <li>
              Github:{" "}
              <a
                className="text-blue-300"
                href="https://github.com/chu0jz013"
                target="_blank"
                rel="noreferrer"
              >
                @chu0jz013
              </a>
            </li>
            <li>
              Linkedin:{" "}
              <a
                className="text-blue-300"
                href="https://www.linkedin.com/in/williamkieuu"
                target="_blank"
                rel="noreferrer"
              >
                williamkieuu
              </a>
            </li>
            <li>
              Personal Website:{" "}
              <a
                className="text-blue-300"
                href={WEBSITE_URL}
                target="_blank"
                rel="noreferrer"
              >
                {WEBSITE_URL}
              </a>
            </li>
          </ul>
        )
      }
    ]
  },
  {
    id: "about-dream",
    title: "my-dream.cpp",
    type: "file",
    content: (
      <div className="py-1">
        <div>
          <span className="text-yellow-400">while</span>(
          <span className="text-blue-400">sleeping</span>) <span>{"{"}</span>
        </div>
        <div>
          <span className="text-blue-400 ml-9">money</span>
          <span className="text-yellow-400">++</span>;
        </div>
        <div>
          <span>{"}"}</span>
        </div>
      </div>
    )
  }
];

export default terminal;
