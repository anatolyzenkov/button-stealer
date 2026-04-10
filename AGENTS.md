# AGENTS.md

## Scope

- Applies to the whole repository.

## Project Shape

- This repo is a Chrome Extension (Manifest V3), not a Node app.
- Core runtime areas:
  - `scripts/button-stealer.js`: content script that finds and stores candidate buttons from visited pages.
  - `scripts/service-worker.js`: background service worker handling storage, icon updates, and message routing.
  - `popup/*`: popup UI and settings.
  - `stolen-buttons/*`: full-page stash/archive UI.
  - `offscreen/*`: offscreen document used for optional Contentful sync for the author's own button workflow; it is not part of the normal end-user flow and is not used in other builds.

## Rules

- Keep the extension MV3-compatible.
- Do not introduce a build step unless explicitly requested.
- Prefer plain HTML/CSS/JS changes over framework-style abstractions.
- Preserve current storage schema unless migration is intentional:
  - `buttons`
  - `upload`
  - `ignore`
  - `maximum`
  - `contentful`
  - `themeMode`
- Hidden buttons are soft-hidden, not hard-deleted. Do not accidentally reset `hidden` flags during routine updates.
- Treat Contentful sync as optional author tooling only. Local-only behavior must continue working when Contentful settings are empty, and non-author builds should not depend on `offscreen/*`.
- Keep popup behavior lightweight. Avoid adding logic that depends on external services for normal use.
- Be careful with content-script changes: they run on arbitrary third-party pages and should stay defensive, minimal, and tolerant of unusual DOM/CSS.

## Editing Guidance

- When changing button selection logic, preserve existing safety filters for visibility, size, and text quality unless the task explicitly changes selection criteria.
- When changing stash/edit-mode UI, avoid layout jumps between normal and edit states.
- When changing icons or theme behavior, distinguish between:
  - toolbar/action icon
  - extension management page icons from `manifest.json`
  - page favicons inside extension HTML
- Prefer backward-compatible storage migrations:
  - use patterns like `value ?? defaultValue`
  - avoid overwriting existing user data unless required
- If a change touches both popup and stash page, keep controls and visual language consistent unless the user asks otherwise.

## Verification

- For UI changes, verify affected files together:
  - markup
  - styling
  - event wiring
- For storage or messaging changes, check both sender and receiver paths before concluding the edit is complete.
