# Pull Request Guidelines

## Branch naming
- `feature/<short-desc>` — new features
- `fix/<short-desc>` — bug fixes
- `chore/<short-desc>` — chores, tooling
- `docs/<short-desc>` — documentation
- `refactor/<short-desc>` — refactors without behavior change

Use hyphens for `<short-desc>`, e.g., `feature/district-list-endpoint`.

## Commit style
- Use Conventional Commits, e.g., `feat(web_server): add /v1/districts endpoint`.
- Keep commits focused and meaningful.

## PR size & scope
- Small, focused PRs are preferred. One PR per task.
- Reference a task ID from `TASKS.md` or an issue.

## Checklist (before requesting review)
- [ ] Code compiles and passes basic linting (where applicable)
- [ ] Added/updated docs and OpenAPI (if API changes)
- [ ] Added tests or sample data (where applicable)
- [ ] No secrets/credentials committed
- [ ] Self-reviewed the diff and comments

## Review process
- Assign at least 1 reviewer from your team.
- Provide clear description: what/why/how and testing steps.
- Address review comments promptly; use follow-up issues for larger topics.

## Merging
- Squash merge is recommended for cleaner history.
- Ensure the title reflects the overall change when squashing.
