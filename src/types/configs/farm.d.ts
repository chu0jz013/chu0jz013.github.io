export interface FarmArt {
  emoji?: string; // placeholder art
  img?: string; // path under public/, e.g. "img/farm/carrot-3.png"
  css?: string; // UnoCSS classes, for the field and soil tiles
}

export interface FarmCrop {
  id: string;
  name: string;
  cost: number; // seed price
  growTime: number; // ms, total time when watered on time
  price: number; // selling price
  art: {
    seed: FarmArt;
    sprout: FarmArt;
    ready: FarmArt;
  };
}

export interface FarmSceneArt {
  background: FarmArt;
  soil: FarmArt;
  empty: FarmArt;
  thirsty: FarmArt;
  coin: FarmArt;
  gift: FarmArt; // the locked chip, and the box that gets unwrapped
  sparkle: FarmArt; // one burst particle, drawn a dozen times
}

export interface FarmReward {
  coins: number; // coin balance that unlocks the reward
  url: string; // opened in the desktop's Safari window when claimed
}

export interface FarmData {
  plotCount: number;
  startCoins: number;
  reward: FarmReward;
  crops: FarmCrop[];
  scene: FarmSceneArt;
}
