
import * as  S from './state.js';
import { renderTable, renderStats, show, fillForm, fillSettings} from './ui.js'
import { compileRegex} from './search.js';
import { check, clean, rules} from './validators.js';
import { parseImport} from './storage.js';
const $ =s => document.querySelector(s);
const FIELDS = ['description', 'amount', 'category', 'date'];

function refresh() {
    const re = compileRegex($('#q').value, $('#ci').checked ? 'i' : '');
    $('#qmsg').textContent = $('#q').value && !re ? 'invalid pattern.' :'';
    renderTable(re); renderStats();
}

function validatefield(f) {
    const el = $('#' + f);
    if (f === 'description') el.value = clean(el.value);
    const msg = check(f,el.value);
    $('#e-' + f).textContent =msg;
    el.setAttribute('aria-invalid',msg ? 'true' : 'false');
    return !msg;
}
FIELDS.forEach(f => $('#' + f).addEventListener('input', () => validatefield(f)));

$('#tx').addEventListener('submit', e =>{
    e.preventDefault();
    const ok = FIELDS.map(validatefield).every(Boolean);
    if (!ok) { $('#' + FIELDS.find(f => $('#' + f).getAttribute('aria-invalid') ==='true')).focus(); return;}
    const f ={ description: $('#description').value, amount: parseFloat($('#amount').value), category: $('#category').value, date: $('#date').value};
    const id = $('#id').value;
    id ? S.update(id, f) : S.add(f);
    fillForm(null); refresh(); location.hash = '#records';
    $('#qmsg').textContent = id ? 'transaction updated.' : 'transaction added.';

});
$('#cancel').addEventListener('click', () => fillForm(null));

$('#rows').addEventListener('click', e => {
  const { edit, del } = e.target.dataset;
  if (edit) { fillForm(S.state.records.find(r => r.id === edit)); location.hash = '#form'; $('#description').focus(); }
  if (del && confirm('Delete this transaction?')) { S.remove(del); refresh(); $('#qmsg').textContent = 'Transaction deleted.'; }
});
$('#q').addEventListener('input', refresh);
$('#ci').addEventListener('change', refresh);
$('#sort').addEventListener('change', e => {
  const [key, dir] = e.target.value.split(':');
  S.state.sort = { key, dir: +dir }; refresh();
});

$('#set').addEventListener('submit', e => {
    e.preventDefault();
    const n = id => $('#' + id).value;
    if (![n('cap'), n('eur'), n('rwf')].every(v => rules.amount.re.test(v))) { $('#smsg').textContent = 'enter valid numbers in every field.'; return; }
    S.state.settings = { cap: +n('cap'), eur: +n('eur'), rwf: +n('rwf') };
    S.persist(); refresh(); $('#smsg').textContent = 'settings saved.';

});
$('#export').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(S.state.records, null, 2)], { type: 'application/json'}));
    a.download = 'transactions.json'; a.click(); URL.revokeObjectURL(a.href);
    $('#smsg').textContent = 'exported.';


});

$('#import').addEventListener('change', async e => {
    try { S.replaceAll(parseImport(await e.target.files[0].text())); refresh(); $('#smsg').textContent = 'import complete.';}
    catch (err) { $('#smsg').textContent = 'imported failed: ' + err.message; }
    e.target.value = '';

});

window.addEventListener('hashchange', () => show(location.hash.slice(1)));
const seed = await fetch('seed.json').then(r => r.json()).catch(() => []);
S.init(seed); fillSettings(); refresh(); show(location.hash.slice(1));
