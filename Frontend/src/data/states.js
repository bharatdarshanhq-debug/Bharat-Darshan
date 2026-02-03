import heroImage from "@/assets/ExperienceHero.webp";

/**
 * List of states available in the application.
 * States contain destinations, which contain packages.
 * @type {Array<Object>}
 */
export const states = [
  {
    id: 1,
    name: "Odisha",
    slug: "odisha",
    image: heroImage,
    slogan: "The Soul of Incredible India",
    description: "Discover the land of temples, pristine beaches, and rich cultural heritage. From the sacred Jagannath Temple to the architectural marvel of Konark Sun Temple.",
    isComingSoon: false,
    destinations: ["Puri"]
  },
  {
    id: 2,
    name: "Kashmir",
    slug: "kashmir",
    image: null,
    slogan: "Paradise on Earth",
    description: "Experience the breathtaking beauty of snow-capped mountains, serene lakes, and lush valleys.",
    isComingSoon: true,
    destinations: []
  },
  {
    id: 3,
    name: "Goa",
    slug: "goa",
    image: null,
    slogan: "The Pearl of the Orient",
    description: "Sun, sand, and sea await you at India's favorite beach destination.",
    isComingSoon: true,
    destinations: []
  },
  {
    id: 4,
    name: "Kerala",
    slug: "kerala",
    image: null,
    slogan: "God's Own Country",
    description: "Explore backwaters, hill stations, and Ayurvedic wellness retreats.",
    isComingSoon: true,
    destinations: []
  },
  {
    id: 5,
    name: "Andaman",
    slug: "andaman",
    image: null,
    slogan: "Tropical Paradise",
    description: "Crystal clear waters, pristine beaches, and exotic marine life.",
    isComingSoon: true,
    destinations: []
  },
  {
    id: 6,
    name: "Varanasi",
    slug: "varanasi",
    image: null,
    slogan: "The Eternal City",
    description: "The spiritual capital of India with ancient temples and sacred ghats.",
    isComingSoon: true,
    destinations: []
  },
  {
    id: 7,
    name: "Himachal",
    slug: "himachal",
    image: null,
    slogan: "Land of the Gods",
    description: "Majestic mountains, adventure sports, and serene monasteries.",
    isComingSoon: true,
    destinations: []
  }
];

/**
 * Get state by slug
 * @param {string} slug 
 * @returns {Object|undefined}
 */
export const getStateBySlug = (slug) => {
  return states.find(s => s.slug === slug.toLowerCase());
};

/**
 * Get all active states (not coming soon)
 * @returns {Array<Object>}
 */
export const getActiveStates = () => {
  return states.filter(s => !s.isComingSoon);
};

/**
 * Get all coming soon states
 * @returns {Array<Object>}
 */
export const getComingSoonStates = () => {
  return states.filter(s => s.isComingSoon);
};
