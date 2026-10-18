
export const rules = {
    description: {re:/^\S(?:.*\S)?$/, message: 'no leading or trailing spaces.'},
    amount : {re: /^(0|[1-9]\d*)(\.\d{1,2})?$/, message: 'use a number such as 12 or 12.50.'},
    date :{re: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, message: 'use a date in the format YYYY-MM-DD.'},
    category : {re: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/, message: 'letters, spaces and hyphens only.'},
};
export const dupwords = /\b(\w+)\s+\1\b/i; // back-reference

export const clean = s => s.replace(/\s{2,}/g, ' ');

export function check(field, value) {
    if (!rules[field].re.test(value)) return rules[field].message;
    if (field === 'description' && dupwords.test(value)) return 'a word is repeated.';
    return '';
}
export function isValidRecord(r) {
    return r && typeof r.id === 'string' && /^[\w-]+$/.test(r.id) 
        && typeof r.description === 'string' && r.description.trim() !== ''
        && typeof r.amount === 'number' && r.amount >= 0
        && rules.category.re.test(r.category) && rules.date.re.test(r.date);
}
