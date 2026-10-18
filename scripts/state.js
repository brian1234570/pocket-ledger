
import { load, save } from './storage.js';
export const state = {
    records: [],
    settings: {cap:500, eur: 0.92, rwf:1450},
    sort: {key:'date', dir: -1},
};
export function persist() { save({records: state.records, settings: state.settings, sort}); }
export function init(seed) {
    const saved = load();
    if (saved && Array.isArray(saved.records)) {state.records = saved.records;Object.assign(state.settings, saved.settings);}
    else {state.records = seed; persist();}
}
const now = new Date(). toISOString();
export function add(f) {
    const id = 'rec_'+ Date.now().toString(36);
    state.records.push({id, ...f, created: now(), updated: now()});
    persist();  
}
export function update(id, f) {
    const r = state.records.find(x => x.id === id);
    if (r) {Object.assign(r, f, {updated: now()}); persist();}
}
export function remove(id) {state.records = state.records.filter(r => r.id !== id); persist();}
export function replaceAll(list) {state.records = list; persist();}
export function view (re) {
    const {key, dir} = state.sort;
    return state.records
        .filter(r => !re || re.test([r.date, r.description, r.amount, r.category].join(' ')))
        .sort((a, b) => (a[key] < b[key] ? 1 : a[key] > b[key] ? -1 : 0) * dir);
}


    