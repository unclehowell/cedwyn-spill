# Tag+bag: preserve project artifacts

`tag+bag` is a separate agent-executed workflow. It does not change the existing `spill` command or its facts-only submission API.

## Trigger and access boundary

Run this workflow when the owner says `tag+bag` or `Tag+bag per bucklerfamily.estate/spill/`. The agent performing the work may inspect only conversation messages and attachments available in its current session. It must not claim access to another chat, a hidden attachment, or a private history it cannot read. The Spill Worker cannot read chats and must not receive a GitHub credential. Do not use the fact-only `spill_submit` endpoint to upload files or create catalogue records.

## Select artifacts carefully

Consider only source artifacts that are materially relevant to the Great House Farm / Tŷ Mawr, Cedwyn, or related project scope. Candidate inputs are user-provided documents or files, attachments visible in this session, and cited source documents or URLs. A conversation sentence, plan, theory, or recollection is not itself a documentary artifact. If an owner statement is worth recording, label it explicitly as an owner statement and keep it separate from documentary evidence.

Exclude secrets, credentials, tokens, payment data, unrelated personal files, private or third-party correspondence without explicit authority to publish it, and personal data about living private people. Do not infer missing source material from a link or from a message summary. Keep the source's identity, place and date distinct; do not assume that a same-named place is the project location.

## Before any repository write

1. Read the current `unclehowell/bucklerfamily-estate` guidance, catalogue schema, issue and branch state. Work only in that active repository for central catalogue material; never write to the retired `unclehowell/cedwyn` repository.
2. Retrieve or open the exact eligible artifact. If it is unavailable, record the exact URL or attachment and the retrieval failure. Do not claim to have read or saved it.
3. Check the catalogue for duplicates by title, source identifiers and metadata. Where bytes are available, compute SHA-256 and compare it with existing files/records. An identical artifact must reuse the existing record; do not upload it again under a new ID. If file bytes are unavailable, say the byte comparison could not be done.
4. Verify rights and public-release authority for the exact copy, transcription and any archived capture. A missing Creative Commons label does not prove either permission or prohibition. Read the applicable terms and identify a lawful route; if permission is unclear, publish only a rights-safe citation and request rights-holder clarification. Do not create a public copy, full transcription or full-page capture until permitted.
5. Preserve authorized original bytes unchanged. Record SHA-256, source URL or source message reference, capture/download date, rights statement and repo path. Do not put secrets or private data into a public branch.

## Catalogue record and presentation

Create one record per eligible artifact using the current `data/core/schema/core-record.schema.json`. Keep documentary description, transcription status, transcription and interpretation in their separate schema fields. Link the local repository copy, not a third-party download URL, when an authorized copy exists. Use a real preview only when one exists; otherwise label the preview as a placeholder. For a permitted transcription, reproduce the text faithfully, mark illegible or uncertain OCR as uncertain, and present the full transcription collapsed by default below the description, preview and local file link. Put a distinct, evidence-bounded interpretation after the transcription; never blend interpretation into source text. Record rights limits and provenance. For a web capture, keep the original source URL and capture timestamp and distinguish the captured page from the agent's interpretation.

## Execution and verification

Use the connected GitHub route only when it confirms the target repository, branch and write. Work on a feature branch, record the task in the existing issue, read each write back, run the repository's available tests and request a Cloudflare-generated preview for web changes. Keep the PR unmerged and production unchanged until the owner has inspected the actual preview and separately authorized any publication step.

A source download failure blocks only that artifact. Inaccessible chat history blocks only items that depend on it. Unclear rights block only the public copy, full transcription or capture that needs those rights. Missing catalogue-write access blocks only the corresponding repository record. Finish independent safe work and report each blocked artifact, the observed reason, the exact next authorized step and any verified record or file URLs. Never invent hashes, catalogue IDs, preview URLs or successful writes.
