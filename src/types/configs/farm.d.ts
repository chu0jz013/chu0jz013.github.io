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
}

export interface FarmData {
  plotCount: number;
  startCoins: number;
  crops: FarmCrop[];
  scene: FarmSceneArt;
}
