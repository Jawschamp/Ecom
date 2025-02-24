import React from 'react';
import { Crown, Sparkles, Gamepad, Pizza } from 'lucide-react';

export const SHOP_CATEGORIES = {
  super_awesome: {
    icon: () => <Crown className="w-6 h-6 text-yellow-400" />,
    title: "✨ Super Awesome Stuff ✨",
    description: "Things that make you go WOOOOW!",
    items: [
      {
        id: 1,
        name: "Magic Rainbow Socks",
        description: "They don't actually change color, but they're still cool!",
        price: 19.99,
        quality: 5,
        image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=400&fit=crop",
        sellerComment: "My grandma knitted these while riding a unicorn! 🦄"
      },
      {
        id: 2,
        name: "Anti-Gravity Coffee Mug",
        description: "Keeps your coffee in place* (*when right side up)",
        price: 24.99,
        quality: 4,
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop",
        sellerComment: "60% of the time, it works every time! ☕"
      },
      {
        id: 6,
        name: "Glow-in-the-Dark Toothbrush",
        description: "Lights up your smile - literally!",
        price: 29.99,
        quality: 5,
        image: "https://images.unsplash.com/photo-1623733164938-5ee2b93123e6?w=400&h=400&fit=crop",
        sellerComment: "Went viral for making brushing feel like a rave! 🪥✨"
      }
    ]
  },
  totally_random: {
    icon: () => <Sparkles className="w-6 h-6 text-purple-400" />,
    title: "🎲 Totally Random Things 🎲",
    description: "You never knew you needed these!",
    items: [
      {
        id: 3,
        name: "Invisible Pen",
        description: "School is coming and your kid uses a laptop, GET IT ANYWAYS",
        price: 9.99,
        quality: 3,
        image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=400&fit=crop",
        sellerComment: "Perfect for writing secret messages that even YOU can't read! 🔍 (Warning: May actually be an empty pen case) 😉"
      },
      {
        id: 7,
        name: "Mini Desktop Vacuum",
        description: "Sucks up crumbs and tiny regrets from your desk",
        price: 14.99,
        quality: 4,
        image: "https://images.unsplash.com/photo-1603894584373-2d71b8f06a83?w=400&h=400&fit=crop",
        sellerComment: "TikTok loves this little guy - it's oddly satisfying! 🧹"
      }
    ]
  },
  gaming_goodies: {
    icon: () => <Gamepad className="w-6 h-6 text-green-400" />,
    title: "🎮 Gaming Goodies 🕹️",
    description: "Level up your life!",
    items: [
      {
        id: 4,
        name: "Cardboard Gaming PC",
        description: "Eco-friendly gaming setup, batteries not included (or needed)",
        price: 49.99,
        quality: 5,
        image: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=400&h=400&fit=crop",
        sellerComment: "Made from 100% recycled dreams! 🌱"
      },
      {
        id: 8,
        name: "RGB Gaming Gloves",
        description: "Light-up gloves for ultimate hand-eye coordination",
        price: 39.99,
        quality: 5,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop",
        sellerComment: "Streamers can't stop showing these off - pure RGB vibes! 🌈"
      }
    ]
  },
  food_fun: {
    icon: () => <Pizza className="w-6 h-6 text-red-400" />,
    title: "🍕 Food Fun 🌮",
    description: "Deliciously silly eats!",
    items: [
      {
        id: 5,
        name: "Infinite Pizza Slice",
        description: "The more you eat, the more there is! (Results may vary)",
        price: 15.99,
        quality: 5,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=400&fit=crop",
        sellerComment: "Warning: May cause infinite happiness! 🍕"
      },
      {
        id: 9,
        name: "Edible Coffee Cup",
        description: "Drink your coffee, then eat the cup - zero waste!",
        price: 12.99,
        quality: 4,
        image: "https://images.unsplash.com/photo-1494314675226-cca9f87f251f?w=400&h=400&fit=crop",
        sellerComment: "This went viral for being crunchy and caffeinated! ☕🍪"
      }
    ]
  }
};