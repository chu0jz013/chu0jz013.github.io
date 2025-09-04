import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeExternalLinks from "rehype-external-links";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula, prism } from "react-syntax-highlighter/dist/esm/styles/prism";
import bear from "~/configs/bear";
import type { BearMdData } from "~/types";

interface ContentProps {
  contentID: string;
  contentURL: string;
}

interface MiddlebarProps {
  items: BearMdData[];
  cur: number;
  setContent: (id: string, url: string, index: number) => void;
}

interface SidebarProps {
  cur: number;
  setMidBar: (items: BearMdData[], index: number) => void;
}

interface BearState extends ContentProps {
  curSidebar: number;
  curMidbar: number;
  midbarList: BearMdData[];
}

const Highlighter = (dark: boolean): any => {
  interface codeProps {
    node: any;
    inline: boolean;
    className: string;
    children: any;
  }

  return {
    code({ node, inline, className, children, ...props }: codeProps) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={dark ? dracula : prism}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className}>{children}</code>
      );
    }
  };
};

const Sidebar = ({ cur, setMidBar }: SidebarProps) => {
  return (
    <div text-white>
      <div className="h-12 pr-3 hstack space-x-3 justify-end">
        <span className="i-ic:baseline-cloud-off text-xl" />
        <span className="i-akar-icons:settings-vertical text-xl" />
      </div>
      <ul>
        {bear.map((item, index) => (
          <li
            key={`bear-sidebar-${item.id}`}
            className={`pl-6 h-8 hstack cursor-default ${
              cur === index ? "bg-red-500" : "bg-transparent"
            } ${cur === index ? "" : "hover:bg-gray-600"}`}
            onClick={() => setMidBar(item.md, index)}
          >
            <span className={item.icon} />
            <span className="ml-2">{item.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Middlebar = ({ items, cur, setContent }: MiddlebarProps) => {
  return (
    <ul>
      {items.map((item: BearMdData, index: number) => (
        <li
          key={`bear-midbar-${item.id}`}
          className={`h-24 flex flex-col cursor-default border-l-2 ${
            cur === index
              ? "border-red-500 bg-white dark:bg-gray-900"
              : "border-transparent bg-transparent"
          } hover:(bg-white dark:bg-gray-900)`}
          onClick={() => setContent(item.id, item.file, index)}
        >
          <div className="h-8 mt-3 hstack">
            <div className="-mt-1 w-10 vstack text-c-500">
              <span className={item.icon} />
            </div>
            <span className="relative flex-1 font-bold" text="gray-900 dark:gray-100">
              {item.title}
              {item.link && (
                <a
                  pos="absolute top-1 right-4"
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="i-ant-design:link-outlined text-c-500" />
                </a>
              )}
            </span>
          </div>
          <div className="flex-1 ml-10" p="b-2 r-1" text="sm c-500" border="b c-300">
            {item.excerpt}
          </div>
        </li>
      ))}
    </ul>
  );
};

const getRepoURL = (url: string) => {
  return url.slice(0, -10) + "/";
};

const fixImageURL = (text: string, contentURL: string): string => {
  text = text.replace(/&nbsp;/g, "");
  if (contentURL.indexOf("raw.githubusercontent.com") !== -1) {
    const repoURL = getRepoURL(contentURL);

    const imgReg = /!\[(.*?)\]\((.*?)\)/;
    const imgRegGlobal = /!\[(.*?)\]\((.*?)\)/g;

    const imgList = text.match(imgRegGlobal);

    if (imgList) {
      for (const img of imgList) {
        const imgURL = (img.match(imgReg) as Array<string>)[2];
        if (imgURL.indexOf("http") !== -1) continue;
        const newImgURL = repoURL + imgURL;
        text = text.replace(imgURL, newImgURL);
      }
    }
  }
  return text;
};

const cleanMarkdown = (text: string): string => {
  // Remove HTML comments
  let cleaned = text.replace(/<!--([\s\S]*?)-->/g, "");

  // Remove "Connect with me" section (HTML heading to next <h3 or end)
  cleaned = cleaned.replace(
    /<h3[^>]*>\s*Connect with me:?[\s\S]*?(?=<h3[^>]*>|$)/gi,
    ""
  );

  // Remove "Languages and Tools" section
  cleaned = cleaned.replace(
    /<h3[^>]*>\s*Languages and Tools:?[\s\S]*?(?=<h3[^>]*>|$)/gi,
    ""
  );

  // Trim excessive blank lines
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n").trim();

  return cleaned;
};

const Content = ({ contentID, contentURL }: ContentProps) => {
  const [storeMd, setStoreMd] = useState<{ [key: string]: string }>({});
  const dark = useStore((state) => state.dark);

  const fetchMarkdown = useCallback(
    (id: string, url: string) => {
      if (!storeMd[id]) {
        fetch(url)
          .then((response) => response.text())
          .then((text) => {
            const withFixedImages = fixImageURL(text, url);
            const cleaned = cleanMarkdown(withFixedImages);
            storeMd[id] = cleaned;
            setStoreMd({ ...storeMd });
          })
          .catch((error) => console.error(error));
      }
    },
    [storeMd]
  );

  useEffect(() => {
    fetchMarkdown(contentID, contentURL);
  }, [contentID, contentURL, fetchMarkdown]);

  return (
    <div className="markdown w-full md:w-2/3 mx-auto px-4 md:px-2 py-6 text-c-700 pt-20 md:pt-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[
          rehypeKatex,
          rehypeRaw,
          [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }]
        ]}
        components={Highlighter(dark as boolean)}
      >
        {storeMd[contentID]}
      </ReactMarkdown>
    </div>
  );
};

const Bear = () => {
  const [state, setState] = useState<BearState>({
    curSidebar: 0,
    curMidbar: 0,
    midbarList: bear[0].md,
    contentID: bear[0].md[0].id,
    contentURL: bear[0].md[0].file
  });
  
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMiddlebar, setShowMiddlebar] = useState(false);

  const setMidBar = (items: BearMdData[], index: number) => {
    setState({
      curSidebar: index,
      curMidbar: 0,
      midbarList: items,
      contentID: items[0].id,
      contentURL: items[0].file
    });
    setShowSidebar(false);
    setShowMiddlebar(false);
  };

  const setContent = (id: string, url: string, index: number) => {
    setState({
      ...state,
      curMidbar: index,
      contentID: id,
      contentURL: url
    });
    setShowSidebar(false);
    setShowMiddlebar(false);
  };

  return (
    <div className="bear font-avenir flex h-full relative">
      {/* Elegant Mobile Navigation */}
      <div className="md:hidden absolute top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => {
              setShowSidebar(!showSidebar);
              if (!showSidebar) setShowMiddlebar(false);
            }}
            className="group flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <div className="flex flex-col space-y-1">
              <div className={`w-4 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${showSidebar ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`w-4 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${showSidebar ? 'opacity-0' : ''}`}></div>
              <div className={`w-4 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${showSidebar ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Menu</span>
          </button>
          
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Bear
          </div>
          
          <button
            onClick={() => {
              setShowMiddlebar(!showMiddlebar);
              if (!showMiddlebar) setShowSidebar(false);
            }}
            className="group flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Files</span>
            <div className="flex flex-col space-y-1">
              <div className={`w-4 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${showMiddlebar ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`w-4 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${showMiddlebar ? 'opacity-0' : ''}`}></div>
              <div className={`w-4 h-0.5 bg-gray-600 dark:bg-gray-300 transition-all duration-300 ${showMiddlebar ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </div>
          </button>
        </div>
      </div>
      <div className={`
        ${showSidebar ? 'block' : 'hidden'} 
        md:block 
        absolute md:relative 
        top-16 md:top-0 
        left-0 
        w-72 md:w-44 
        h-[calc(100%-4rem)] md:h-full 
        z-40 md:z-auto 
        overflow-auto bg-gray-700
        shadow-xl md:shadow-none
        rounded-r-xl md:rounded-none
      `}>
        <Sidebar cur={state.curSidebar} setMidBar={setMidBar} />
      </div>
      <div className={`
        ${showMiddlebar ? 'block' : 'hidden'} 
        md:block 
        absolute md:relative 
        top-16 md:top-0 
        left-0 md:left-auto
        w-full md:w-60 
        h-[calc(100%-4rem)] md:h-full 
        z-40 md:z-auto 
        overflow-auto bg-gray-50 dark:bg-gray-800 
        border-r border-gray-300
        shadow-xl md:shadow-none
        rounded-r-xl md:rounded-none
      `}>
        <Middlebar
          items={state.midbarList}
          cur={state.curMidbar}
          setContent={setContent}
        />
      </div>
      <div className="flex-1 overflow-auto" bg="gray-50 dark:gray-800">
        <Content contentID={state.contentID} contentURL={state.contentURL} />
      </div>
    </div>
  );
};

export default Bear;
