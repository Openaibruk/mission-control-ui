# SKILL.md Specification (Claude Code-Compatible)

Standard format based on [markdown.engineering/learn-claude-code/03-skills-system](https://www.markdown.engineering/learn-claude-code/03-skills-system).

## YAML Frontmatter Fields

```yaml
---
name: "Display Name"                          # Override directory name
description: "One-line summary for skill listing"
when_to_use: "Trigger conditions with examples"
allowed-tools:                                 # Tool permission patterns
  - Read
  - Write
  - Bash(gh:*)
arguments: arg1 arg2                           # Named arguments → $arg1, $arg2 in body
argument-hint: "[arg1] [arg2]"                 # CLI autocomplete placeholder
context: fork                                  # Run as isolated sub-agent (omit for inline)
model: claude-opus-4-5                         # Model override (alias or provider/model)
effort: low                                    # Thinking budget: low/medium/high
paths: src/payments/**                         # Conditional activation (glob patterns)
user-invocable: true                           # Hide from /skills menu if false
shell:
  interpreter: bash                            # Shell config for !backtick execution
---
```

**Important:**
- `description` is the primary signal for Claude to decide when to use the skill
- `when_to_use` gives detailed trigger instructions
- `arguments` maps positionally: `$arg1` = first argument, `$arg2` = second
- `context: fork` runs skill in isolated sub-agent (use for self-contained tasks)
- `paths` makes skill conditional — only appears when matching files are opened

## File Structure

```
<skill-name>/
├── SKILL.md          # Frontmatter + main instructions
├── references/       # Reference materials (design guides, API docs)
│   ├── spec.md
│   └── examples.md
└── examples/         # Example outputs
    └── sample.md
```

## Key Principles from Source Analysis

1. **Description quality matters** — it's the only signal the selector model sees for relevance
2. **Keep SKILL.md focused** — use `references/` for supporting docs, not inline
3. **Version your skills** — update when you learn something new
4. **Test before committing** — run the skill end-to-end to catch substitution errors
5. **Use `when_to_use`** — prevents skill from triggering on unrelated tasks
