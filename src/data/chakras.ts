export type ChakraInfo = {
  name: string;
  color: string;
  advice: string;
};

export const COLOR_TO_CHAKRA: Record<string, ChakraInfo> = {
  '#E84C4C': {
    name: 'Root Chakra (Muladhara)',
    color: '#E84C4C',
    advice: 'Work on grounding, stability, and security. Practice grounding exercises, connect with nature, and focus on physical health.',
  },
  '#FF9F43': {
    name: 'Sacral Chakra (Svadhisthana)',
    color: '#FF9F43',
    advice: 'Focus on creativity, emotions, and sensuality. Engage in creative activities, practice emotional awareness, and honor your feelings.',
  },
  '#FFD84D': {
    name: 'Solar Plexus Chakra (Manipura)',
    color: '#FFD84D',
    advice: 'Strengthen personal power, confidence, and self-esteem. Practice self-empowerment exercises, set boundaries, and build self-confidence.',
  },
  '#4CD964': {
    name: 'Heart Chakra (Anahata)',
    color: '#4CD964',
    advice: 'Cultivate love, compassion, and forgiveness. Practice heart-opening exercises, show compassion to others and yourself, and practice forgiveness.',
  },
  '#5AC8FA': {
    name: 'Throat Chakra (Vishuddha)',
    color: '#5AC8FA',
    advice: 'Develop communication and self-expression. Practice speaking your truth, engage in creative expression, and listen actively to others.',
  },
  '#3A6FF7': {
    name: 'Third Eye Chakra (Ajna)',
    color: '#3A6FF7',
    advice: 'Enhance intuition, insight, and wisdom. Practice meditation, trust your intuition, and develop your inner vision.',
  },
  '#FF7EB6': {
    name: 'Crown Chakra (Sahasrara)',
    color: '#FF7EB6',
    advice: 'Connect with spirituality and higher consciousness. Practice meditation, connect with the divine, and seek spiritual understanding.',
  },
  '#C9CCD6': {
    name: 'Balance All Chakras',
    color: '#C9CCD6',
    advice: 'Your aura shows balance. Maintain harmony through regular meditation, energy work, and self-care practices.',
  },
  '#000000': {
    name: 'Energy Blockage',
    color: '#000000',
    advice: 'Focus on clearing energy blockages. Practice energy clearing techniques, meditation, and seek balance in all chakras.',
  },
};
