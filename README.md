# CASMI26 Chemistry Desk

Public English materials and source for our chemistry review workspace.

- [Live discussion board](https://casmi26-chemistry-desk.jinseobae.chatgpt.site/): public reading; Sign in with ChatGPT to post or reply and delete your own contributions.
- [Case workspace](https://ys06146.github.io/casmi26-chemistry-board/guide.html): 17 structure comparisons, 44 spectra, and a fully explained worked example.
- [Six-slide presentation](https://ys06146.github.io/casmi26-chemistry-board/presentation.html)
- [Speaker notes](https://ys06146.github.io/casmi26-chemistry-board/speaker-notes.html)
- [Study notes](https://ys06146.github.io/casmi26-chemistry-board/slide-study.html)
- [Original example discussion](https://github.com/ys06146/casmi26-chemistry-board/issues/1), preserved and translated.

## Posting and deletion

The live board stores posts and replies in a database. Authentication determines ownership; a display name is not an authentication credential. Only an author can delete or resolve their own post, or delete their own reply. Deleting a post hides its replies too. Authors can restore posts from **My deleted posts**. This is recoverable deletion, not permanent erasure. Email addresses and account IDs are not returned in public responses.

GitHub Issues remain an archive and optional GitHub discussion channel. GitHub issue deletion is restricted to repository administrators. Use the live board for author-controlled deletion.

## Evidence and scope

The public case subset includes 17 structures and 44 spectra from a RIKEN comparison of 100 structures / 279 spectra. It contains recorded correct structures, comparison candidates, SMILES, observed spectra, and v3/v4 ranks. It does not contain the complete raw experiment data or local filesystem paths. The worked example separates observations, proposed chemistry, and verified saved-score replay. No new model runs or submissions were performed for this English edition.

The guide keeps personal notes in browser storage. Export/import JSON to transfer them. Existing notes remain compatible; user-authored notes are preserved as written.

## Implementation and verification

The server app uses the official Sites Vinext starter, Sign in with ChatGPT, and Cloudflare D1. Its core implementation is in `app-source/`; API ownership enforcement runs server-side. The static HTML files can be downloaded and used independently. The source is also versioned in the hosting service's source repository.

Local validation passed type checking, production build, and 24 API checks including anonymous writes, cross-origin writes, ownership, deletion, restoration, and replies. Browser sign-in and posting were verified; subsequent visual/deletion-dialog QA was stopped by the browser tool's URL-verification protection. A production authenticated write/delete cycle has not been claimed as tested.
