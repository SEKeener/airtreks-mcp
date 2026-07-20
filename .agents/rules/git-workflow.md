# Git workflow

The git workflow for this repo. Team spec by Bogdan (brain.airtreks.com/developers/git-workflow), reinforced by Mihai in Slack 2026-07-20 (main branch protected across all Airtreks org repos — no delete, no force-push). Reproduced verbatim below, in clearly separated sections.

---

## GROUND RULES (always — both modes)

- main is a protected branch — never commit to or push main directly. Every change ships via a short-lived branch and a pull request: branch → PR → merge.
- Cut every branch off the latest origin/main. Resync with "git reset --hard origin/main", never "git pull" (squash merges diverge).
- Branch naming: [yourname]/air-XXX-note — my handle, the Linear ticket, then a short note (e.g. [yourname]/air-396-posthog-tools).

## HOW TO BEHAVE (every task)

- Pick the mode from, in order: (1) what I say in chat ("single task" / "parallel task"); (2) a [single task] or [parallel task] tag in the Linear issue title. If neither specifies it, DEFAULT to a parallel task (Mode A) — the safe, fully-isolated choice. Tell me which mode you're using so I can redirect. "single task" or [single task] → Mode B; "parallel task" or [parallel task] or unspecified → Mode A.
- How far you take it on your own — commit, push, open the PR, merge — is my call: ask me whether to do those automatically or pause for my review before publishing. Different people want different levels of autonomy.

## MODE A — PARALLEL / MULTI-AGENT (one git worktree per task; also use for any non-trivial work)

[worktrees-dir] = any folder OUTSIDE this repo (a sibling folder is fine). Never inside the repo, and never .claude/worktrees/ (that is Claude Code's own harness worktrees). One agent = one worktree = one branch.

  1) Start each task in a fresh worktree + branch (run from the repo root):
     git fetch origin
     git worktree add [worktrees-dir]/air-XXX-note -b [yourname]/air-XXX-note origin/main
     cd [worktrees-dir]/air-XXX-note
  2) Do the work + commit:
     git add -A
     git commit -m "clear message"
  3) Ship it — open the PR and merge (only after I approve):
     git push -u origin [yourname]/air-XXX-note
     gh pr create --fill --base main
     gh pr checks --watch
     gh pr merge --squash --delete-branch
  4) Tear down the worktree:
     cd <repo root>
     git worktree remove [worktrees-dir]/air-XXX-note
     git fetch origin

  Parallel agents: split work by file/area so PRs don't overlap. Conflicts resolve at merge — the second PR rebases (git fetch origin && git merge origin/main, fix, push), CI re-runs, then merges.

## MODE B — SINGLE SIMPLE TASK (a minor fix, one agent, no parallel work; no worktree needed)

Work directly in the clone on a branch. The one rule that still holds: never work on main itself.

  1) Branch off the latest main (run from the repo root):
     git switch main
     git fetch origin
     git reset --hard origin/main
     git switch -c [yourname]/air-XXX-note
  2) Do the work, commit, and ship (only after I approve):
     git add -A && git commit -m "clear message"
     git push -u origin [yourname]/air-XXX-note
     gh pr create --fill --base main
     gh pr checks --watch
     gh pr merge --squash --delete-branch
  3) Reset for the next task:
     git switch main && git fetch origin && git reset --hard origin/main
