import { AuraColorKey } from './auraTypes';

export type AuraResultOption = {
  primerColor: AuraColorKey;
  secondColor?: {
    color: AuraColorKey;
    range: '1-10' | '10-19';
  };
  thirdColor?: {
    color: AuraColorKey;
    range: '1-10' | '10-19';
  };
  description: string;
};

export const AURA_GAME_RESULTS: Record<AuraColorKey, AuraResultOption[]> = {
  '#E84C4C': [
    {
      primerColor: '#E84C4C',
      description:
        'You are a good, vibrant, energetic person and a natural leader. You know how to achieve your goals, but you approach decision-making with your heart.',
    },
    {
      primerColor: '#E84C4C',
      secondColor: { color: '#FFD84D', range: '1-10' },
      description:
        'You are determined, but sometimes your energy is softened by a ray of creativity. There is a balance between action and thinking.',
    },
    {
      primerColor: '#E84C4C',
      secondColor: { color: '#FFD84D', range: '10-19' },
      description:
        'Your strength combines with bright creative energy. You are able not only to act but also to inspire others to change.',
    },
    {
      primerColor: '#E84C4C',
      secondColor: { color: '#FFD84D', range: '1-10' },
      thirdColor: { color: '#4CD964', range: '1-10' },
      description:
        'You are active and determined, a bit creative and sincere. This time for you is a period of moderate development in all aspects of your personality.',
    },
    {
      primerColor: '#E84C4C',
      secondColor: { color: '#FFD84D', range: '10-19' },
      thirdColor: { color: '#4CD964', range: '10-19' },
      description:
        'You are in harmony with yourself and the world. Strong energy, bright creativity, and sincerity combine to create a powerful aura.',
    },
  ],

  '#FF9F43': [
    {
      primerColor: '#FF9F43',
      description:
        'You are a good and simple person by nature, who tries to find understanding in others. Such people love to be useful, so they often become doctors, social workers, rescuers—those who help others.',
    },
    {
      primerColor: '#FF9F43',
      secondColor: { color: '#FFD84D', range: '1-10' },
      description:
        'Your kindness combines with a gentle creative light. You support others while growing yourself.',
    },
    {
      primerColor: '#FF9F43',
      secondColor: { color: '#FFD84D', range: '10-19' },
      description:
        'You are both kind and creative at the same time. People feel your energy and seek your advice.',
    },
    {
      primerColor: '#FF9F43',
      secondColor: { color: '#FFD84D', range: '1-10' },
      thirdColor: { color: '#4CD964', range: '1-10' },
      description:
        'You are sincere, warm, and a bit creative. Your inner balance is at a good level right now.',
    },
    {
      primerColor: '#FF9F43',
      secondColor: { color: '#FFD84D', range: '10-19' },
      thirdColor: { color: '#4CD964', range: '10-19' },
      description:
        'Your aura is harmonious and strong. Kindness, creativity, and sincerity mutually enhance each other.',
    },
  ],

  '#FFD84D': [
    {
      primerColor: '#FFD84D',
      description:
        'You are a creative, intellectual, and very open person. You probably love to learn and improve others.',
    },
    {
      primerColor: '#FFD84D',
      secondColor: { color: '#FF9F43', range: '1-10' },
      description:
        'Your creativity combines with warm openness to people. You interact harmoniously with the world.',
    },
    {
      primerColor: '#FFD84D',
      secondColor: { color: '#FF9F43', range: '10-19' },
      description:
        'Creativity and kindness form your strong aura, which inspires and helps others.',
    },
    {
      primerColor: '#FFD84D',
      secondColor: { color: '#FF9F43', range: '1-10' },
      thirdColor: { color: '#4CD964', range: '1-10' },
      description:
        'You are creative, open, and sincere, but not yet fully developed in secondary areas. Good balance for growth.',
    },
    {
      primerColor: '#FFD84D',
      secondColor: { color: '#FF9F43', range: '10-19' },
      thirdColor: { color: '#4CD964', range: '10-19' },
      description:
        'Your aura shines with creativity, kindness, and sincerity. This is a time when your inner potential manifests most fully.',
    },
  ],

  '#4CD964': [
    {
      primerColor: '#4CD964',
      description:
        'You are a sincere person with a fairly narrow circle of communication. You find it hard to tolerate injustice, so you always try to fix everything bad that happens in life.',
    },
    {
      primerColor: '#4CD964',
      secondColor: { color: '#E84C4C', range: '1-10' },
      description:
        'Your sincerity combines with gentle determination. You maintain harmony while being ready to act when needed.',
    },
    {
      primerColor: '#4CD964',
      secondColor: { color: '#E84C4C', range: '10-19' },
      description:
        'Your sincerity and determination create a powerful aura of balance and justice.',
    },
    {
      primerColor: '#4CD964',
      secondColor: { color: '#FFD84D', range: '1-10' },
      thirdColor: { color: '#5AC8FA', range: '1-10' },
      description:
        'You are sincere, creative, and open to new experiences. Your aura reflects growth and harmony.',
    },
    {
      primerColor: '#4CD964',
      secondColor: { color: '#FFD84D', range: '10-19' },
      thirdColor: { color: '#5AC8FA', range: '10-19' },
      description:
        'Your aura shines with sincerity, creativity, and wisdom. You are in perfect harmony with yourself and nature.',
    },
  ],

  '#5AC8FA': [
    {
      primerColor: '#5AC8FA',
      description:
        'You love to travel, discover, and learn something new. You cannot live without impressions, but you need to know how to rest and stop in time, otherwise you may feel exhausted.',
    },
    {
      primerColor: '#5AC8FA',
      secondColor: { color: '#FFD84D', range: '1-10' },
      description:
        'Your thirst for knowledge combines with creative thinking. You find joy in learning and sharing discoveries.',
    },
    {
      primerColor: '#5AC8FA',
      secondColor: { color: '#FFD84D', range: '10-19' },
      description:
        'Your curiosity and creativity form an inspiring aura. You are a seeker of truth and new experiences.',
    },
    {
      primerColor: '#5AC8FA',
      secondColor: { color: '#4CD964', range: '1-10' },
      thirdColor: { color: '#3A6FF7', range: '1-10' },
      description:
        'You are open to new experiences, sincere, and intuitive. Your aura reflects growth and spiritual depth.',
    },
    {
      primerColor: '#5AC8FA',
      secondColor: { color: '#4CD964', range: '10-19' },
      thirdColor: { color: '#3A6FF7', range: '10-19' },
      description:
        'Your aura shines with wisdom, sincerity, and spiritual depth. You are a true seeker of knowledge and harmony.',
    },
  ],

  '#3A6FF7': [
    {
      primerColor: '#3A6FF7',
      description:
        'This aura color belongs to humanitarians who subconsciously try to protect the weak. At the same time, they are very demanding of themselves, so they often become mentally and physically exhausted. High impulsiveness can negatively affect important life decisions.',
    },
    {
      primerColor: '#3A6FF7',
      secondColor: { color: '#5AC8FA', range: '1-10' },
      description:
        'Your compassion combines with a thirst for knowledge. You seek to understand and help others while learning.',
    },
    {
      primerColor: '#3A6FF7',
      secondColor: { color: '#5AC8FA', range: '10-19' },
      description:
        'Your humanitarian spirit and wisdom create a powerful aura of protection and understanding.',
    },
    {
      primerColor: '#3A6FF7',
      secondColor: { color: '#4CD964', range: '1-10' },
      thirdColor: { color: '#C9CCD6', range: '1-10' },
      description:
        'You are compassionate, sincere, and intuitive. Your aura reflects a balance between action and reflection.',
    },
    {
      primerColor: '#3A6FF7',
      secondColor: { color: '#4CD964', range: '10-19' },
      thirdColor: { color: '#C9CCD6', range: '10-19' },
      description:
        'Your aura shines with compassion, sincerity, and spiritual insight. You are a true protector and guide for others.',
    },
  ],

  '#FF7EB6': [
    {
      primerColor: '#FF7EB6',
      description:
        'These people love work but do not like criticism. It prevents them from achieving their goals.',
    },
    {
      primerColor: '#FF7EB6',
      secondColor: { color: '#E84C4C', range: '1-10' },
      description:
        'Your determination combines with gentle passion. You are focused on your goals while maintaining warmth.',
    },
    {
      primerColor: '#FF7EB6',
      secondColor: { color: '#E84C4C', range: '10-19' },
      description:
        'Your passion and determination create a strong aura of achievement and focus.',
    },
    {
      primerColor: '#FF7EB6',
      secondColor: { color: '#FFD84D', range: '1-10' },
      thirdColor: { color: '#FF9F43', range: '1-10' },
      description:
        'You are creative, warm, and goal-oriented. Your aura reflects a balance between ambition and kindness.',
    },
    {
      primerColor: '#FF7EB6',
      secondColor: { color: '#FFD84D', range: '10-19' },
      thirdColor: { color: '#FF9F43', range: '10-19' },
      description:
        'Your aura shines with creativity, warmth, and determination. You achieve your goals while inspiring others.',
    },
  ],

  '#C9CCD6': [
    {
      primerColor: '#C9CCD6',
      description:
        'This color indicates humanitarians who stand out for their dreaminess and developed imagination. Their intuition is so high that they can achieve a high level of spiritual development.',
    },
    {
      primerColor: '#C9CCD6',
      secondColor: { color: '#3A6FF7', range: '1-10' },
      description:
        'Your intuition combines with compassion. You see beyond the surface and understand deeper truths.',
    },
    {
      primerColor: '#C9CCD6',
      secondColor: { color: '#3A6FF7', range: '10-19' },
      description:
        'Your intuition and spiritual depth create a powerful aura of wisdom and protection.',
    },
    {
      primerColor: '#C9CCD6',
      secondColor: { color: '#5AC8FA', range: '1-10' },
      thirdColor: { color: '#4CD964', range: '1-10' },
      description:
        'You are intuitive, wise, and sincere. Your aura reflects spiritual growth and harmony.',
    },
    {
      primerColor: '#C9CCD6',
      secondColor: { color: '#5AC8FA', range: '10-19' },
      thirdColor: { color: '#4CD964', range: '10-19' },
      description:
        'Your aura shines with intuition, wisdom, and sincerity. You have reached a high level of spiritual development.',
    },
  ],

  '#000000': [
    {
      primerColor: '#000000',
      description:
        'Black in the aura can represent hidden potential, transformation, or the need for protection. It may indicate a time of change or deep introspection.',
    },
    {
      primerColor: '#000000',
      secondColor: { color: '#C9CCD6', range: '1-10' },
      description:
        'Your transformative energy combines with intuition. You are going through a period of deep change and growth.',
    },
    {
      primerColor: '#000000',
      secondColor: { color: '#C9CCD6', range: '10-19' },
      description:
        'Your transformative power and intuition create a strong aura of mystery and spiritual depth.',
    },
    {
      primerColor: '#000000',
      secondColor: { color: '#3A6FF7', range: '1-10' },
      thirdColor: { color: '#5AC8FA', range: '1-10' },
      description:
        'You are going through transformation, guided by compassion and wisdom. Your aura reflects deep change.',
    },
    {
      primerColor: '#000000',
      secondColor: { color: '#3A6FF7', range: '10-19' },
      thirdColor: { color: '#5AC8FA', range: '10-19' },
      description:
        'Your aura shines with transformative power, compassion, and wisdom. You are experiencing profound spiritual growth.',
    },
  ],
};
