// src/utils/avatarUtils.ts
import { CustomAvatarConfig } from '../types/career';

export type CharacterArchetype = 
  | 'tech' 
  | 'creator' 
  | 'billionaire' 
  | 'specialist' 
  | 'titan' 
  | 'healer' 
  | 'explorer';

export function getCharacterArchetype(title: string, code?: string): CharacterArchetype {
  const t = title.toLowerCase();
  if (t.includes('테크') || t.includes('혁신') || t.includes('ai') || t.includes('개발') || t.includes('공학') || t.includes('데이터')) return 'tech';
  if (t.includes('크리에이터') || t.includes('창작') || t.includes('예술') || t.includes('디자이너') || t.includes('작가') || t.includes('웹툰')) return 'creator';
  if (t.includes('백만장자') || t.includes('부자') || t.includes('사업') || t.includes('투자') || t.includes('금융') || t.includes('ceo')) return 'billionaire';
  if (t.includes('권위자') || t.includes('전문직') || t.includes('의사') || t.includes('변호사') || t.includes('약사') || t.includes('연구')) return 'specialist';
  if (t.includes('거인') || t.includes('산업') || t.includes('엔지니어') || t.includes('플랜트') || t.includes('항공') || t.includes('선박')) return 'titan';
  if (t.includes('힐링') || t.includes('마스터') || t.includes('카페') || t.includes('선생님') || t.includes('상담') || t.includes('따뜻')) return 'healer';
  
  if (code && code.includes('T')) return 'tech';
  if (code && code.includes('C')) return 'creator';
  if (code && code.includes('L')) return 'specialist';
  
  return 'explorer';
}

export function getDefaultConfigFromArchetype(archetype: CharacterArchetype): CustomAvatarConfig {
  switch (archetype) {
    case 'tech':
      return {
        gender: 'boy',
        face: 'confident',
        hair: 'two_block',
        hairColor: '#1E293B',
        outfit: 'developer',
        accessory: 'square',
        item: 'laptop'
      };
    case 'creator':
      return {
        gender: 'girl',
        face: 'sparkle',
        hair: 'bob',
        hairColor: '#7C3AED',
        outfit: 'creator',
        accessory: 'none',
        item: 'tablet'
      };
    case 'billionaire':
      return {
        gender: 'boy',
        face: 'confident',
        hair: 'comma',
        hairColor: '#854D0E',
        outfit: 'suit',
        accessory: 'round',
        item: 'none'
      };
    case 'specialist':
      return {
        gender: 'boy',
        face: 'confident',
        hair: 'short_dandy',
        hairColor: '#0F172A',
        outfit: 'doctor',
        accessory: 'round',
        item: 'stethoscope'
      };
    case 'titan':
      return {
        gender: 'boy',
        face: 'smile',
        hair: 'two_block',
        hairColor: '#451A03',
        outfit: 'police',
        accessory: 'none',
        item: 'book'
      };
    case 'healer':
      return {
        gender: 'girl',
        face: 'smile',
        hair: 'long_wave',
        hairColor: '#92400E',
        outfit: 'chef',
        accessory: 'none',
        item: 'pan'
      };
    case 'explorer':
    default:
      return {
        gender: 'boy',
        face: 'sparkle',
        hair: 'comma',
        hairColor: '#1E293B',
        outfit: 'school',
        accessory: 'none',
        item: 'book'
      };
  }
}
