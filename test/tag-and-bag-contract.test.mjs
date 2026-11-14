import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const contract = JSON.parse(read('tag-and-bag.json'));
const llms = read('llms.txt');
const page = read('index.html');
const spillProtocol = JSON.parse(read('protocol.json'));
const workflow = read('TAG-AND-BAG.md');

test('tag+bag has its own explicit trigger and is surfaced to people and agents', () => {
  assert.equal(contract.name, 'tag+bag');
  assert.ok(contract.trigger.phrases.some((phrase) => phrase.toLowerCase().includes('tag+bag')));
  assert.ok(contract.trigger.distinct_from === 'spill');
  assert.match(llms, /## Tag\+bag: a separate artifact workflow/);
  assert.match(llms, /tag-and-bag\.json/);
  assert.match(page, /Tag\+bag per bucklerfamily\.estate\/spill\//);
  assert.match(page, /tag-and-bag\.json/);
  assert.match(workflow, /## Trigger and access boundary/);
});

test('only the current agent can inspect accessible chat; the Worker gets no chat or credentials', () => {
  assert.match(contract.execution_boundary.session_access, /currently accessible/);
  assert.equal(contract.execution_boundary.worker_can_read_chat, false);
  assert.equal(contract.execution_boundary.worker_can_write_catalogue, false);
  assert.equal(contract.execution_boundary.worker_receives_github_credentials, false);
  assert.equal(contract.execution_boundary.spill_api_accepts_files, false);
  assert.match(workflow, /must not receive a GitHub credential/);
});

test('selection is project-scoped and excludes private or unrelated material', () => {
  assert.ok(contract.eligibility.project_scope.some((scope) => /Great House Farm/.test(scope)));
  for (const excluded of ['Secrets, passwords, tokens or credentials', 'Payment data', 'Unrelated personal material', 'Private or third-party correspondence without explicit public-release authority', 'Personal data about living private people']) {
    assert.ok(contract.eligibility.exclude.includes(excluded), `missing exclusion: ${excluded}`);
  }
  assert.match(contract.eligibility.owner_statement_rule, /owner statement/);
  assert.match(workflow, /A conversation sentence, plan, theory, or recollection is not itself a documentary artifact/);
});

test('duplicate checks, provenance and source hashes precede catalogue writes', () => {
  assert.equal(contract.deduplication.check_before_write, true);
  assert.match(contract.deduplication.byte_hash, /SHA-256/);
  assert.match(contract.workflow[2], /duplicates/);
  assert.match(contract.workflow[4], /SHA-256/);
  assert.equal(contract.catalogue.repository, 'unclehowell/bucklerfamily-estate');
  assert.equal(contract.catalogue.schema_path, 'data/core/schema/core-record.schema.json');
  assert.equal(contract.catalogue.record_per_artifact, true);
});

test('rights, collapsed transcription and separate interpretation are explicit', () => {
  assert.equal(contract.rights.no_permission_inference_from_missing_license, true);
  assert.ok(contract.rights.check_each_use.includes('Full transcription'));
  assert.ok(contract.catalogue.required_separation.includes('interpretation'));
  assert.match(workflow, /collapsed by default/);
  assert.match(workflow, /evidence-bounded/);
});

test('existing Spill remains a facts-only endpoint protocol', () => {
  assert.match(spillProtocol.meaning, /Facts only/);
  assert.ok(spillProtocol.mcp_tools.includes('spill_submit'));
  assert.equal(contract.execution_boundary.preserve_existing_spill, 'The existing spill command remains facts-only and unchanged.');
  assert.match(page, /does not change the facts-only/);
});
