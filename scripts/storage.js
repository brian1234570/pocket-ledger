import { isValidRecord } from './validators.js';
const KEY = 'fin:data';
export function load() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}
export function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { console.error(e); }
}
export function parseImport(text) {
  let d;
  try { d = JSON.parse(text); } catch { throw new Error('File is not valid JSON.'); }
  const list = Array.isArray(d) ? d : d && d.records;
  if (!Array.isArray(list)) throw new Error('Expected an array of records.');
  const bad = list.findIndex(r => !isValidRecord(r));
  if (bad !== -1) throw new Error('Record ' + (bad + 1) + ' is invalid.');
  return list;
}