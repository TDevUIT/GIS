# Branching Guide

This document defines how we create, name, and manage Git branches for the IE402 project.

## Branch Types

- feature/<scope>-<short-description>
  - Purpose: New features or enhancements
  - Example: `feature/web-map-layer-toggle`, `feature/data-import-csv`

- fix/<scope>-<short-description>
  - Purpose: Bug fixes that are not emergencies
  - Example: `fix/web-client-build-error`, `fix/gis-server-projection`

- hotfix/<scope>-<short-description>
  - Purpose: Emergency fixes for production
  - Example: `hotfix/api-rate-limit`

- chore/<scope>-<short-description>
  - Purpose: Maintenance tasks (deps, configs, refactors without behavior change)
  - Example: `chore/update-deps`, `chore/ci-workflow`

- docs/<scope>-<short-description>
  - Purpose: Documentation-only changes
  - Example: `docs/add-branching-guide`

- release/<version>
  - Purpose: Prepare a release
  - Example: `release/0.1.0`

## Naming Rules

- Use lowercase kebab-case for descriptions: `short-description`
- Keep names short but meaningful (max 5-7 words)
- Use a clear scope when relevant (e.g., `web-client`, `gis-server`, `data-processor`)
- Avoid ticket numbers unless required; if used: `feature/web-client-123-layer-toggle`

## Default Branch

- The default branch is `main`.
- No direct commits to `main`. All changes come from Pull Requests.

## Workflow

1. Create a branch from `main`:
   - `git checkout -b feature/<scope>-<short-description>`
2. Commit frequently with conventional commit messages (see `docs/PR_GUIDE.md`):
   - Example: `feat(web-client): add layer toggle UI`
3. Push your branch and open a Pull Request to `main`.
4. Ensure PR meets checklist: build passes, lint passes, docs/tests updated.
5. Squash merge preferred (keeps history clean). If you need to preserve commits, use normal merge.

## Long-Lived Branches

- Avoid long-lived branches. Rebase from `main` frequently to reduce conflicts:
  - `git fetch origin`
  - `git rebase origin/main`

## Branch Protection Recommendations

If enabled on GitHub:
- Require PR reviews before merging to `main`.
- Require status checks to pass (CI, lint, tests).
- Restrict who can push to `main`.

## Clean Up

- Delete branches on merge (via GitHub UI) to keep the repo tidy.

## Examples

- `feature/web-client-map-search`
- `fix/data-processor-geojson-parse`
- `docs/update-api-conventions`
- `chore/renovate-config`
- `release/0.2.0`
