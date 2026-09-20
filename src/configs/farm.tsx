import type { FarmData } from "~/types";

// Every visual is referenced here, so changing the art means editing this file
// only. Crop sprites are 16x16 pixel art on a full-size viewBox, so a seedling
// stays visibly smaller than a ripe crop; the soil and field stay flat CSS.
const farm: FarmData = {
  plotCount: 12,
  startCoins: 50,

  // Hit `reward.coins` and the farm hands out a link. On a desktop it plays in
  // the Safari window, which needs the embed form — a youtube.com/watch URL
  // refuses to be framed. A phone gets the watch URL as a real tab instead,
  // because no iframe is allowed to autoplay there.
  reward: {
    coins: 500,
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&playsinline=1",
    mobileUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },

  crops: [
    {
      id: "carrot",
      name: "Carrot",
      cost: 10,
      growTime: 3000,
      price: 20,
      art: {
        seed: { img: "img/farm/seed.svg" },
        sprout: { img: "img/farm/carrot-sprout.svg" },
        ready: { img: "img/farm/carrot.svg" }
      }
    },
    {
      id: "banana",
      name: "Banana",
      cost: 25,
      growTime: 5000,
      price: 70,
      art: {
        seed: { img: "img/farm/seed.svg" },
        sprout: { img: "img/farm/banana-sprout.svg" },
        ready: { img: "img/farm/banana.svg" }
      }
    },
    {
      id: "corn",
      name: "Corn",
      cost: 80,
      growTime: 10000,
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
    coin: { img: "img/farm/coin.svg" },
    gift: { emoji: "🎁" },
    sparkle: { emoji: "✨" }
  }
};

export default farm;
