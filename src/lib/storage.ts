import type { Attempt, ThemePreference } from '../types';
const KEY='study-mark:v2:attempts', THEME='study-mark:theme';
export function loadAttempts(storage:Pick<Storage,'getItem'>=localStorage):Record<string,Attempt>{try{const raw=storage.getItem(KEY);if(!raw)return{};const data:unknown=JSON.parse(raw);if(!data||typeof data!=='object'||Array.isArray(data))return{};return Object.fromEntries(Object.entries(data).filter(([,v])=>v&&typeof v==='object'&&(v as Attempt).version===2)) as Record<string,Attempt>;}catch{return{};}}
export function saveAttempts(value:Record<string,Attempt>,storage:Pick<Storage,'setItem'>=localStorage){try{storage.setItem(KEY,JSON.stringify(value));return true;}catch{return false;}}
export function loadTheme(storage:Pick<Storage,'getItem'>=localStorage):ThemePreference{try{const v=storage.getItem(THEME);return v==='light'||v==='dark'||v==='system'?v:'system';}catch{return'system';}}
export function saveTheme(v:ThemePreference,storage:Pick<Storage,'setItem'>=localStorage){try{storage.setItem(THEME,v);}catch{/* preferences are non-critical */}}
