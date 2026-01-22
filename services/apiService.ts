import { TrendingDish } from '../types';

export interface LeadData {
  dishName: string;
  restaurantName: string;
  restaurantPhone: string;
  userEmail?: string | null;
  timestamp: string;
  dishImageUrl?: string | null;
}

// A pool of high-quality images to map to keywords so the UI looks good even for new searches
const IMAGE_BANK: Record<string, string> = {
  'burger': "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80",
  'pizza': "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80",
  'sushi': "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=80",
  'salad': "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80",
  'pasta': "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=500&q=80",
  'coffee': "https://images.unsplash.com/photo-1515823664972-6d66e8e1c1c2?auto=format&fit=crop&w=500&q=80",
  'dessert': "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=500&q=80",
  'taco': "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=500&q=80",
  'default': "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80"
};

const DEFAULT_TRENDING: TrendingDish[] = [
  {
    id: 't-1',
    name: "Truffle Burger",
    query: "Where can I get the best Truffle Burger nearby?",
    image: IMAGE_BANK['burger'],
    popularity: 100
  },
  {
    id: 't-2',
    name: "Acai Bowl",
    query: "Find the best Acai Bowls nearby.",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=500&q=80",
    popularity: 90
  },
  {
    id: 't-3',
    name: "Matcha Latte",
    query: "Best Matcha Latte and coffee shops nearby.",
    image: IMAGE_BANK['coffee'],
    popularity: 85
  },
  {
    id: 't-4',
    name: "Sushi Platter",
    query: "High rated Sushi restaurants nearby.",
    image: IMAGE_BANK['sushi'],
    popularity: 80
  }
];

export const apiService = {
  uploadDishImage: async (base64Data: string): Promise<string> => {
    // If running on a static host without the backend API configured, return empty string gracefully
    // to allow the frontend to continue functioning (just without the image link in WhatsApp)
    try {
      const response = await fetch('/api/upload-dish-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Data }),
      });

      if (response.status === 404 || response.status === 500) {
        console.warn("Backend API not found or failed. Proceeding in offline/static mode.");
        return "";
      }

      if (!response.ok) {
        return "";
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      // SIlent failure acceptable here
      console.warn("Upload service unavailable");
      return "";
    }
  },

  trackLead: async (leadData: LeadData): Promise<void> => {
    try {
      fetch('/api/track-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      }).catch(() => {
        // Ignore errors for analytics tracking
      });
    } catch (e) {
      // Ignore
    }
  },

  getTrendingDishes: async (): Promise<TrendingDish[]> => {
    try {
      const stored = localStorage.getItem('snapfood_trending');
      let localData: TrendingDish[] = stored ? JSON.parse(stored) : [];

      DEFAULT_TRENDING.forEach(defItem => {
        if (!localData.find(d => d.name === defItem.name)) {
          localData.push(defItem);
        }
      });

      return localData.sort((a, b) => b.popularity - a.popularity).slice(0, 6);
    } catch (e) {
      return DEFAULT_TRENDING;
    }
  },

  recordInteraction: async (term: string): Promise<void> => {
    try {
      const cleanTerm = term.trim();
      if (!cleanTerm || cleanTerm.length < 3) return;

      const stored = localStorage.getItem('snapfood_trending');
      let localData: TrendingDish[] = stored ? JSON.parse(stored) : [...DEFAULT_TRENDING];

      const existingIndex = localData.findIndex(
        d => d.name.toLowerCase() === cleanTerm.toLowerCase()
      );

      if (existingIndex > -1) {
        localData[existingIndex].popularity += 5;
      } else {
        let imgUrl = IMAGE_BANK['default'];
        const lowerTerm = cleanTerm.toLowerCase();
        
        for (const key of Object.keys(IMAGE_BANK)) {
          if (lowerTerm.includes(key)) {
            imgUrl = IMAGE_BANK[key];
            break;
          }
        }

        const newItem: TrendingDish = {
          id: `t-${Date.now()}`,
          name: cleanTerm.replace(/\b\w/g, l => l.toUpperCase()), 
          query: `Best ${cleanTerm} nearby`,
          image: imgUrl,
          popularity: 50 
        };
        localData.push(newItem);
      }

      localStorage.setItem('snapfood_trending', JSON.stringify(localData));
    } catch (e) {
      console.error("Failed to record interaction", e);
    }
  }
};