# CASMI26 Team Workspace

Public English materials and source for our chemistry review workspace.

- [Live team dashboard](https://casmi26-chemistry-desk.jinseobae.chatgpt.site/): shared assignments, progress, experiment records, team access, and activity history.
- [Discussion board](https://casmi26-chemistry-desk.jinseobae.chatgpt.site/discussion#questions): public reading; Sign in with ChatGPT to post or reply and delete your own contributions.
- [Case library](https://ys06146.github.io/casmi26-chemistry-board/cases.html): all 17 case files, structure pairs, 44 spectra, chemistry review prompts, and case-specific discussions.
- [Private case notes](https://ys06146.github.io/casmi26-chemistry-board/guide.html): the original guide and the confirm0003 worked interpretation.
- [Six-slide presentation](https://ys06146.github.io/casmi26-chemistry-board/presentation.html)
- [Speaker notes](https://ys06146.github.io/casmi26-chemistry-board/speaker-notes.html)
- [Study notes](https://ys06146.github.io/casmi26-chemistry-board/slide-study.html)
- [Original example discussion](https://github.com/ys06146/casmi26-chemistry-board/issues/1), preserved and translated.

## Shared team planning

Teammates sign in with ChatGPT, choose a public display name and focus, and request access in **Team**. The owner approves recognized teammates. Approved members can update all 17 cases, team goals and meeting details, and experiment records. Anonymous visitors and pending members cannot edit shared work. Reading remains public; work notes and the chosen display names are public too.

Case progress uses **Not reviewed → In progress → Needs input → Complete**. Cases start unassigned and unreviewed; the worked example is not automatically marked complete. Each case supports a due date, next step, and review notes. Experiments support a question/setup, results, decision, and recoverable archive. Three suggested experiments are labeled **Planned**, with no invented results.

Changes are persisted in the hosted database, with a before/after activity history. Version checks prevent silent overwrites when two people edit the same item. The losing editor keeps their draft and can explicitly load the latest values. The guide's older personal notes remain browser-local; they are separate from the shared dashboard notes.

The server recognizes the owner from the immutable author identity of the existing verified chemistry example, never from a public alias or a client-supplied role. Raw authentication IDs and email addresses are not exposed in public responses.

## Posting and deletion

The live board stores posts and replies in a database. Authentication determines ownership; a display name is not an authentication credential. Only an author can delete or resolve their own post, or delete their own reply. Deleting a post hides its replies too. Authors can restore posts from **My deleted posts**. This is recoverable deletion, not permanent erasure. Email addresses and account IDs are not returned in public responses.

GitHub Issues remain an archive and optional GitHub discussion channel. GitHub issue deletion is restricted to repository administrators. Use the live board for author-controlled deletion.

## Evidence and scope

The public case subset includes 17 structures and 44 spectra from a RIKEN comparison of 100 structures / 279 spectra. It contains recorded correct structures, comparison candidates, SMILES, observed spectra, and v3/v4 ranks. It does not contain the complete raw experiment data or local filesystem paths. The worked example separates observations, proposed chemistry, and verified saved-score replay. No new model runs or submissions were performed for this English edition.

The guide keeps personal notes in browser storage. Export/import JSON to transfer them. Existing notes remain compatible; user-authored notes are preserved as written.

## Implementation and verification

The server app uses the official Sites Vinext starter, Sign in with ChatGPT, and Cloudflare D1. Its core implementation is in `app-source/`; API ownership enforcement runs server-side. The static HTML files can be downloaded and used independently. The source is also versioned in the hosting service's source repository.

Validation passed type checking, production build, and 31 API checks. Case filtering uses exact normalized IDs on the server, including author-owned trash. In the live board, sign-in, posting, replies, deletion, and post restoration were verified with the owner account. Temporary test content was removed from public view. Only confirm0003 has a completed chemical interpretation; the remaining case files contain measured data and review prompts.

Dashboard update (November 3, 2026): 31 additional local integration checks cover membership, server-side write authorization, persistence, validation, conflict detection, idempotent retries, experiment archiving, and public identity privacy. The original SQL migration is unchanged; the missing baseline journal entry was restored, and the new migration only creates three dashboard tables and indexes.
