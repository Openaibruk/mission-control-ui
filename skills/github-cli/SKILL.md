---
name: github-cli
description: Use the GitHub CLI (gh) to manage repositories, pull requests, issues, and GitHub Actions. Triggers on requests to "create a PR", "check github issues", "gh repo view", "gh pr list", or "github actions status".
---

# GitHub CLI (gh) Skill

This skill provides instructions for using the `gh` command-line tool.

## Core Principles
- Verify authentication first: `gh auth status`. If not authenticated, prompt the user to run `gh auth login` or provide a `GH_TOKEN`.
- When dealing with PRs or issues, use the `--web` flag if the user explicitly asks to view it in a browser, otherwise output to the terminal.
- Use `--json` and `jq` for programmatic parsing of gh outputs when chaining commands.

## Common Commands

### Pull Requests (PRs)
- **List PRs**: `gh pr list`
- **View PR details**: `gh pr view <number>`
- **Create a PR**: `gh pr create --title "..." --body "..."`
- **Checkout a PR**: `gh pr checkout <number>`
- **Merge a PR**: `gh pr merge <number> --squash`

### Issues
- **List Issues**: `gh issue list`
- **View Issue**: `gh issue view <number>`
- **Create Issue**: `gh issue create --title "..." --body "..."`
- **Comment on Issue**: `gh issue comment <number> --body "..."`

### Repositories
- **Clone**: `gh repo clone <owner>/<repo>`
- **View Repo Info**: `gh repo view`

### GitHub Actions (Workflows)
- **List Runs**: `gh run list`
- **View Run Logs**: `gh run view <run-id> --log`
- **Trigger Workflow**: `gh workflow run <workflow-name.yml>`