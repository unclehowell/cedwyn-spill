import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const spill = readFileSync(new URL('../spill.js', import.meta.url), 'utf8');
const start = spill.indexOf('function cols(id,rows){');
const end = spill.indexOf('\n  var SC=', start);
assert.ok(start >= 0 && end > start, 'chart columns renderer is present');

const rendererSource = spill.slice(start, end);
const nodes = new Map();
const lookup = id => {
  if (!nodes.has(id)) nodes.set(id, { innerHTML: '' });
  return nodes.get(id);
};
const escapeText = value => String(value == null ? '' : value).replace(/[&<>\"]/g, ch => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
})[ch]);
const renderColumns = new Function('$', 'esc', `${rendererSource}; return cols;`)(lookup, escapeText);

function labelsFor(id) {
  const html = lookup(id).innerHTML;
  return [...html.matchAll(/<text class="lab" text-anchor="([^"]+)" x="([^"]+)" y="([^"]+)">([^<]*)<\/text>/g)]
    .map(match => ({ anchor: match[1], x: Number(match[2]), text: match[4] }));
}

test('30-day chart anchors edge labels inward inside the 340-unit SVG', () => {
  const rows = Array.from({ length: 30 }, (_, i) => ({
    l: `${String(i).padStart(2, '0')}/11`,
    a: i === 0 ? 0 : 1
  }));
  renderColumns('g-day', rows);
  const labels = labelsFor('g-day');

  assert.equal(labels[0].anchor, 'start');
  assert.equal(labels.at(-1).anchor, 'end');
  assert.ok(labels.every(label => label.x > 0 && label.x < 340));
});

test('single-item chart label remains centered', () => {
  renderColumns('one-day', [{ l: '14/11', a: 2 }]);
  const labels = labelsFor('one-day');

  assert.equal(labels.length, 1);
  assert.equal(labels[0].anchor, 'middle');
  assert.equal(labels[0].text, '14/11');
});
