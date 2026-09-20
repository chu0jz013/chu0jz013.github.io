import { motion } from "framer-motion";
import { farm } from "~/configs";
import type { FarmArt, FarmCrop } from "~/types";

const STORAGE_KEY = "farm-save";

interface PlotData {
  crop: string | null;
  plantedAt: number;
  wateredAt: number; // 0 until watered
}

interface FarmSave {
  coins: number;
  plots: PlotData[];
  rewarded: boolean; // the reward is claimable once per farm; Reset re-locks it
}

interface Gain {
  index: number;
  amount: number;
  key: number;
}

// `farm` is read inside functions, never destructured at module scope: configs
// imports apps.tsx, which pulls this file back in, so the binding is still in
// its temporal dead zone while this module is evaluating.
const cropOf = (id: string | null) => farm.crops.find((crop) => crop.id === id);

const emptyPlot = (): PlotData => ({ crop: null, plantedAt: 0, wateredAt: 0 });

const emptyFarm = (): FarmSave => ({
  coins: farm.startCoins,
  plots: Array.from({ length: farm.plotCount }, emptyPlot),
  rewarded: false
});

const loadFarm = (): FarmSave => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const save = JSON.parse(raw) as FarmSave;
      if (
        typeof save.coins === "number" &&
        Array.isArray(save.plots) &&
        save.plots.length === farm.plotCount
      )
        return { coins: save.coins, plots: save.plots, rewarded: !!save.rewarded };
    }
  } catch {
    // no save yet, or a broken one: start a fresh farm
  }
  return emptyFarm();
};

const saveFarm = (save: FarmSave) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  } catch {
    // storage blocked (private mode): the farm just won't survive a reload
  }
};

// Growth runs off wall-clock stamps rather than a live timer, so it survives
// closing the window and reloading the page. The first half stalls at 50% until
// the plot is watered; the second half runs from whichever came later, the
// watering or the halfway mark — so watering early costs nothing.
const growthOf = (plot: PlotData, crop: FarmCrop) => {
  const now = Date.now();
  const half = crop.growTime / 2;

  const phase1 = Math.min(now - plot.plantedAt, half);
  const phase2 = plot.wateredAt
    ? Math.min(half, Math.max(0, now - Math.max(plot.wateredAt, plot.plantedAt + half)))
    : 0;

  return {
    progress: Math.min(1, (phase1 + phase2) / crop.growTime),
    thirsty: !plot.wateredAt && phase1 >= half
  };
};

// The caller sizes the sprite: a width utility styles the image branch and a
// font-size utility styles the emoji branch, so one class string serves both.
const Sprite = ({ art, className = "" }: { art: FarmArt; className?: string }) =>
  art.img ? (
    <img className={`object-contain ${className}`} src={art.img} alt="" />
  ) : (
    <span className={className}>{art.emoji}</span>
  );

// Backgrounds accept either a CSS class or an image, so art can be swapped in
// src/configs/farm.ts without touching this file. The class half stays inline in
// the JSX below: UnoCSS's attributify-JSX transformer mangles class strings that
// sit outside a JSX attribute.
const artStyle = (art: FarmArt) =>
  art.img ? { backgroundImage: `url(${art.img})` } : undefined;

interface PlotProps {
  plot: PlotData;
  seed: FarmCrop;
  affordable: boolean;
  gain?: Gain;
  onClick: () => void;
  onGainEnd: () => void;
}

const Plot = ({ plot, seed, affordable, gain, onClick, onGainEnd }: PlotProps) => {
  const { scene } = farm;
  const planted = cropOf(plot.crop);
  const growth = planted && growthOf(plot, planted);

  const ready = growth ? growth.progress >= 1 : false;
  const thirsty = growth ? growth.thirsty : false;
  const clickable = planted ? ready || !plot.wateredAt : affordable;

  const tile = planted ? scene.soil : scene.empty;
  // class strings must come from the config or the static part of a template:
  // UnoCSS's attributify-JSX transformer rewrites class-like tokens that sit in
  // a quoted string it fails to skip over
  const tileCss = tile.img ? "" : tile.css || "";

  let stage: FarmArt | undefined;
  if (planted && growth)
    stage = ready
      ? planted.art.ready
      : growth.progress < 0.5
        ? planted.art.seed
        : planted.art.sprout;

  return (
    <button
      className={`farm-plot group relative aspect-square rounded-lg flex-center text-4xl no-outline transition-transform duration-150 bg-cover bg-center ${tileCss} ${
        ready ? "ring-2 ring-yellow-300" : ""
      } ${
        clickable ? "hover:scale-105" : planted ? "cursor-default" : "cursor-not-allowed"
      }`}
      style={artStyle(tile)}
      onClick={onClick}
    >
      {stage && (
        <Sprite art={stage} className={ready ? "w-3/5 animate-pulse" : "w-3/5"} />
      )}

      {!planted && affordable && (
        <Sprite
          art={seed.art.ready}
          className="farm-seed-preview w-1/2 text-3xl opacity-0 transition-opacity group-hover:opacity-40"
        />
      )}

      {thirsty && (
        <Sprite
          art={scene.thirsty}
          className="absolute top-1 right-1 w-4 text-base animate-pulse"
        />
      )}

      {planted && growth && !ready && (
        <span className="absolute bottom-1.5 w-4/5 h-1.5 rounded-full bg-black/30">
          <span
            className={`block h-full rounded-full transition-[width] duration-200 ${
              thirsty ? "bg-orange-400" : "bg-lime-400"
            }`}
            style={{ width: `${growth.progress * 100}%` }}
          />
        </span>
      )}

      {gain && (
        <motion.span
          key={gain.key}
          className="absolute font-bold text-sm text-yellow-300 pointer-events-none"
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -36 }}
          transition={{ duration: 0.9 }}
          onAnimationComplete={onGainEnd}
        >
          +{gain.amount}
        </motion.span>
      )}
    </button>
  );
};

// Twelve particles thrown evenly around the box when it pops.
const SPARKS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  return { x: Math.cos(angle) * 96, y: Math.sin(angle) * 96 };
});

interface RewardBarProps {
  art: FarmArt;
  unlocked: boolean;
  coins: number;
  target: number;
  onClick: () => void;
}

// A whole row rather than a chip: a first-time visitor has to be able to see
// that something is there to win. Locked it is a goal with a meter, unlocked it
// is a gift worth tapping. It reads the same on a 380px phone window.
const RewardBar = ({ art, unlocked, coins, target, onClick }: RewardBarProps) => {
  if (!unlocked) {
    const filled = Math.min(100, (coins / target) * 100);
    return (
      <div className="px-3 py-1.5 border-b border-c-300 bg-c-200">
        <div className="hstack justify-between text-xs text-c-500">
          <span className="hstack space-x-1.5">
            <Sprite art={art} className="w-4 text-sm opacity-50 grayscale" />
            <span className="font-semibold tracking-wide">REWARD</span>
          </span>
          <span className="font-semibold">
            {coins}/{target}
          </span>
        </div>
        <span className="block mt-1 h-1.5 rounded-full bg-black/20">
          <span
            className="block h-full rounded-full bg-gradient-to-r from-amber-300 to-yellow-400 transition-[width] duration-300"
            style={{ width: `${filled}%` }}
          />
        </span>
      </div>
    );
  }

  return (
    <motion.button
      className="relative w-full overflow-hidden px-3 py-2 border-b border-yellow-500/40 no-outline text-yellow-900 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 shadow-lg shadow-yellow-400/50"
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 1.6, repeat: Infinity }}
      onClick={onClick}
    >
      {/* a shine sweeping the length of the bar */}
      <motion.span
        className="absolute inset-y-0 w-10 bg-white/60 blur-md"
        animate={{ x: [-60, 680] }}
        transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.6 }}
      />
      <span className="relative hstack justify-center space-x-2 text-sm font-bold">
        <motion.span
          animate={{ rotate: [0, -12, 12, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <Sprite art={art} className="w-5 text-base" />
        </motion.span>
        <span>Open your gift</span>
      </span>
    </motion.button>
  );
};

interface UnboxProps {
  gift: FarmArt;
  sparkle: FarmArt;
  onOpened: () => void;
}

// The box shakes, swells, then bursts. `onAnimationComplete` is what actually
// hands out the reward, the same way a floating +coins gain ends itself.
const Unbox = ({ gift, sparkle, onOpened }: UnboxProps) => (
  <motion.div
    className="absolute inset-0 z-20 flex-center bg-black/60 backdrop-blur-sm"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.2 }}
  >
    <motion.span
      className="absolute size-40 rounded-full bg-yellow-300/50 blur-2xl"
      animate={{ scale: [0.5, 1.3, 2.6], opacity: [0.3, 0.9, 0] }}
      transition={{ duration: 1.2 }}
    />

    {SPARKS.map((spark, i) => (
      <motion.span
        className="absolute pointer-events-none"
        key={i}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          x: spark.x,
          y: spark.y,
          opacity: [0, 1, 0],
          scale: [0, 1.3, 0.4]
        }}
        transition={{ duration: 0.8, delay: 0.6 + i * 0.02 }}
      >
        <Sprite art={sparkle} className="w-5 text-lg" />
      </motion.span>
    ))}

    <motion.div
      animate={{
        rotate: [0, -12, 12, -10, 10, 0, 0],
        scale: [0.7, 1, 1, 1, 1, 1.45, 0]
      }}
      transition={{ duration: 1.25, times: [0, 0.12, 0.24, 0.36, 0.48, 0.78, 1] }}
      onAnimationComplete={onOpened}
    >
      <Sprite art={gift} className="w-24 text-7xl drop-shadow-lg" />
    </motion.div>
  </motion.div>
);

const Farm = () => {
  const { crops, reward, scene } = farm;
  const [save, setSave] = useState<FarmSave>(loadFarm);
  const [selected, setSelected] = useState(crops[0].id);
  const [gain, setGain] = useState<Gain | null>(null);
  const [opening, setOpening] = useState(false);
  const [, setTick] = useState(0);
  const openInSafari = useStore((state) => state.openInSafari);
  const { winWidth } = useWindowSize();

  const { coins, plots, rewarded } = save;
  const seed = cropOf(selected) as FarmCrop;
  const fieldCss = scene.background.img ? "" : scene.background.css || "";
  const unlocked = coins >= reward.coins;

  // crops grow against the clock, this only repaints the progress bars
  useInterval(() => setTick((tick) => tick + 1), 250);

  useEffect(() => saveFarm(save), [save]);

  const replacePlot = (index: number, plot: PlotData, coins: number) =>
    setSave({ ...save, coins, plots: plots.map((p, i) => (i === index ? plot : p)) });

  const openGift = () => {
    openInSafari(reward.url);
    setOpening(false);
    setSave({ ...save, rewarded: true });
  };

  // A phone refuses to autoplay a video inside an iframe whatever we do, so
  // there the reward hands itself to YouTube instead: a real tab (or the app),
  // where playback is the platform's own business. Opening it inside the tap is
  // what keeps the popup blocker out of the way. The unboxing and the in-desktop
  // Safari window stay a desktop luxury.
  const claimReward = () => {
    if (winWidth < 640) {
      window.open(reward.mobileUrl, "_blank", "noopener");
      setSave({ ...save, rewarded: true });
      return;
    }
    setOpening(true);
  };

  const clickPlot = (index: number) => {
    const plot = plots[index];
    const planted = cropOf(plot.crop);

    if (!planted) {
      if (coins < seed.cost) return;
      replacePlot(
        index,
        { crop: seed.id, plantedAt: Date.now(), wateredAt: 0 },
        coins - seed.cost
      );
    } else if (!plot.wateredAt) {
      replacePlot(index, { ...plot, wateredAt: Date.now() }, coins);
    } else if (growthOf(plot, planted).progress >= 1) {
      setGain({ index, amount: planted.price, key: Date.now() });
      replacePlot(index, emptyPlot(), coins + planted.price);
    }
  };

  return (
    <div className="relative h-full flex flex-col text-c-black bg-c-100">
      <div className="hstack justify-between px-3 py-1.5 text-sm border-b border-c-300">
        <span className="hstack space-x-1 font-semibold">
          <Sprite art={scene.coin} className="w-4" />
          <span>{coins}</span>
        </span>
        <span className="text-c-500 text-xs truncate px-2">
          Sow on soil · water when{" "}
          <Sprite art={scene.thirsty} className="inline-block w-3.5 align-text-bottom" />{" "}
          shows · tap ripe crops
        </span>
        <button
          className="px-2 py-0.5 text-xs rounded bg-c-300 no-outline"
          onClick={() => {
            setGain(null);
            setSave(emptyFarm());
          }}
        >
          Reset
        </button>
      </div>

      {!rewarded && (
        <RewardBar
          art={scene.gift}
          unlocked={unlocked}
          coins={coins}
          target={reward.coins}
          onClick={claimReward}
        />
      )}

      <div
        className={`flex-1 overflow-y-auto p-3 bg-cover bg-center ${fieldCss}`}
        style={artStyle(scene.background)}
      >
        <div className="grid grid-cols-4 gap-2.5">
          {plots.map((plot, index) => (
            <Plot
              key={index}
              plot={plot}
              seed={seed}
              affordable={coins >= seed.cost}
              gain={gain?.index === index ? gain : undefined}
              onClick={() => clickPlot(index)}
              onGainEnd={() => setGain(null)}
            />
          ))}
        </div>
      </div>

      <div className="hstack justify-center space-x-2 px-3 py-2 border-t border-c-300">
        {crops.map((crop) => (
          <button
            className={`hstack space-x-2 px-2.5 py-1 rounded-lg no-outline bg-c-200 ${
              selected === crop.id ? "ring-2 ring-green-500" : ""
            } ${coins < crop.cost ? "opacity-50" : ""}`}
            key={crop.id}
            onClick={() => setSelected(crop.id)}
          >
            <Sprite art={crop.art.ready} className="w-7 text-2xl" />
            <span className="text-left text-xs leading-tight">
              <span className="block font-semibold">{crop.name}</span>
              <span className="block text-c-500">
                {crop.cost} · {crop.growTime / 1000}s · +{crop.price}
              </span>
            </span>
          </button>
        ))}
      </div>

      {opening && <Unbox gift={scene.gift} sparkle={scene.sparkle} onOpened={openGift} />}
    </div>
  );
};

export default Farm;
