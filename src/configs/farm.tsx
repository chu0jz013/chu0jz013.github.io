import type { FarmData } from "~/types";

// Every visual is referenced here, so changing the art means editing this file
// only. Crop sprites are 16x16 pixel art on a full-size viewBox, so a seedling
// stays visibly smaller than a ripe crop; the soil and field stay flat CSS.
const farm: FarmData = {
  plotCount: 12,
  startCoins: 50,

  crops: [
    {
      id: "carrot",
      name: "Carrot",
      cost: 10,
      growTime: 6000,
      price: 20,
      art: {
        seed: { img: "img/farm/seed.svg" },
        sprout: { img: "img/farm/carrot-sprout.svg" },
        ready: { img: "img/farm/carrot.svg" }
      }
    },
    {
      id: "tomato",
      name: "Tomato",
      cost: 30,
      growTime: 15000,
      price: 75,
      art: {
        seed: { img: "img/farm/seed.svg" },
        sprout: { img: "img/farm/tomato-sprout.svg" },
        ready: { img: "img/farm/tomato.svg" }
      }
    },
    {
      id: "corn",
      name: "Corn",
      cost: 80,
      growTime: 35000,
      price: 220,
      art: {
        seed: { img: "img/farm/seed.svg" },
        sprout: { img: "img/farm/corn-sprout.svg" },
        ready: { img: "img/farm/corn.svg" }
      }
    }
  ],

  scene: {
    background: {
      css: "bg-gradient-to-b from-sky-300 to-lime-200 dark:from-sky-900 dark:to-emerald-900"
    },
    soil: { css: "bg-[#a97155]" },
    empty: { css: "bg-[#8f5f43] border-2 border-dashed border-white/30" },
    thirsty: { img: "img/farm/drop.svg" },
    coin: { img: "img/farm/coin.svg" }
  }
};

export default farm;
