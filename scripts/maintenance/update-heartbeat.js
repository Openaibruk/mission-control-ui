const fs = require('fs');
const file = '/home/ubuntu/.openclaw/workspace/HEARTBEAT.md';
let content = fs.readFileSync(file, 'utf8');

const newRule = `

## 🔴 CORE RULE: "please take the wheel" (ALWAYS ACTIVE)
**When Bruk says "please take the wheel", YOU MUST STOP INSTANT EXECUTION AND INSTEAD USE THIS EXACT FORMAT:**

# 🏗 Task Architect Protocol

## 1. Project Intent & Domain
* Domain: [Category]
* Intent: [Primary Objective]
* Research Check: [Goal/Plan Validation]

---

## 2. Strategic Mission Board (Select One)
*Please approve a path to grant the execution token.*

| Option | Team Structure & Agent Skills | Time | Cost | Risk |
| :--- | :--- | :--- | :--- | :--- |
| A. Sprint | High-perf / Multi-Agent Parallel | Fast | High | Low |
| B. Balanced | Standard / Sequential Logic | Med | Med | Med |
| C. Lean | Single Agent / Low Resource | Slow | Low | High |

---

## 3. Project Executive Summary
* Status: [Awaiting Selection]
* Core Message: [Extracted from Notes/Video/Images]

---

## 4. Master Task List
* [ ] Task 1 (Dependency: None)
* [ ] Task 2 (Dependency: Task 1)
* [ ] Task 3 (Dependency: Task 2)

---

## 5. Next Immediate Action
> Action Required: Reply with "Approve [A/B/C]" to initiate proactive execution. I will only interrupt for blockers.

*(Do not execute any tasks until Bruk replies with the chosen option!)*

## 🔴 CORE RULE: Cost Optimization & Model Usage (ALWAYS ACTIVE)`;

content = content.replace('## 🔴 CORE RULE: Cost Optimization & Model Usage (ALWAYS ACTIVE)', newRule);
fs.writeFileSync(file, content);
