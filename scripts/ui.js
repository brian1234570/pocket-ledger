
import {state, view} from './state.js';
import {highlight} from './search.js';
const $= s => document.querySelector(s);

export function show(name) {
    const id =['dashboard','records','form', 'settings', 'about'].includes(name) ? name : 'dashboard';
    document.querySelectorAll('main > section').forEach(s => s.classList.toggle('active', s.id === id));
}
export function renderTable(re) {
    const tb =$('#rows'), list = view(re);
    if (!list.length) {tb.innerHTML = '<tr><td colspan="5">no records match. clear the search or add one in add / edit.</td></tr>'; return;}
      tb.innerHTML = list.map(r => `<tr><td>${highlight(r.date, re)}</td><td>${highlight(r.description, re)}</td>
    <td>${highlight(r.amount.toFixed(2), re)}</td><td>${highlight(r.category, re)}</td>
    <td><button type="button" data-edit="${r.id}">Edit</button> <button type="button" data-del="${r.id}">Delete</button></td></tr>`).join('');
}
export function renderStats() {
    const rs = state.records, { cap,eur, rwf} =state.settings;
    const sum = rs.reduce((t,r) => t+r.amount,0);
    const bycat ={};
    rs.forEach(r=> bycat[r.category] = (bycat[r.category]||0)+1);
    const top = Object.entries(bycat).sort((a,b)=>b[1]-a[1])[0];
    $('#s-count').textContent =rs.length;
    $('#s-sum').textContent = sum.toFixed(2) + 'usd';
    $('#s-top').textContent = top ? top[0]: 'none';
    $('#s-conv').textContent = `≈ ${(sum * eur).toFixed(2)} EUR · ${(sum * rwf).toFixed(0)} RWF`;

    const days = [], vals = [];
    for (let i = 6; i >=0; i--) {
        const d = new Date(Date.now() -i * 864e5).toISOString().slice(0,10);
        days.push(d.slice(5));
        vals.push(rs.filter(r=> r.date === d).reduce((t,r) =>t+r.amount, 0));

    }

const max =Math.max(...vals,1);
$('#trend').innerHTML = vals.map((v,i)=> `<div style="height:${(v / max) * 100}%" title="${v.toFixed(2)}"><span>${days[i]}</span></div>`).join(''); 
$('#trend').setAttribute('aria-label', 'Last 7 days: ' + vals.map((v, i) => days[i] + ' ' + v.toFixed(2)).join(', '));

const polite = $('#capPolite'), alert = $('#capAlert');
polite.textContent = alert.textContent = '';
if (sum > cap) alert.textContent = `Over cap by ${(sum - cap).toFixed(2)} USD.`;
else polite.textContent = `${(cap - sum).toFixed(2)} USD left under your cap.`;
}

export function fillForm(r) {
    ['id', 'description', 'amount', 'category', 'date'].forEach(k => $('#' +k).value = r ? r[k] : '');
    $('#cancel').hidden = !r;

}
 
export function fillSettings() {
    const s = state.settings;
    $('#cap').value = s.cap; $('#eur').value =s.eur; $('#rwf').value = s.rwf;
}




