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
  plots: Array.from({ length: farm.plotCount }, emptyPlot)
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
        return save;
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
      className={`group relative aspect-square rounded-lg flex-center text-4xl no-outline transition-transform duration-150 bg-cover bg-center ${tileCss} ${
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
          className="w-1/2 text-3xl opacity-0 transition-opacity group-hover:opacity-40"
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

const Farm = () => {
  const { crops, scene } = farm;
  const [save, setSave] = useState<FarmSave>(loadFarm);
  const [selected, setSelected] = useState(crops[0].id);
  const [gain, setGain] = useState<Gain | null>(null);
  const [, setTick] = useState(0);

  const { coins, plots } = save;
  const seed = cropOf(selected) as FarmCrop;
  const fieldCss = scene.background.img ? "" : scene.background.css || "";

  // crops grow against the clock, this only repaints the progress bars
  useInterval(() => setTick((tick) => tick + 1), 250);

  useEffect(() => saveFarm(save), [save]);

  const replacePlot = (index: number, plot: PlotData, coins: number) =>
    setSave({ coins, plots: plots.map((p, i) => (i === index ? plot : p)) });

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
    <div className="h-full flex flex-col text-c-black bg-c-100">
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
    </div>
  );
};

export default Farm;
