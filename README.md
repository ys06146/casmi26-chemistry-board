# CASMI26 Chemistry Desk

Public English materials and source for our chemistry review workspace.

- [Live discussion board](https://casmi26-chemistry-desk.jinseobae.chatgpt.site/): public reading; Sign in with ChatGPT to post or reply and delete your own contributions.
- [Case library](https://ys06146.github.io/casmi26-chemistry-board/cases.html): all 17 case files, structure pairs, 44 spectra, chemistry review prompts, and case-specific discussions.
- [Private case notes](https://ys06146.github.io/casmi26-chemistry-board/guide.html): the original guide and the confirm0003 worked interpretation.
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

Validation passed type checking, production build, and 31 API checks. Case filtering uses exact normalized IDs on the server, including author-owned trash. In the live board, sign-in, posting, replies, deletion, and post restoration were verified with the owner account. Temporary test content was removed from public view. Only confirm0003 has a completed chemical interpretation; the remaining case files contain measured data and review prompts.
