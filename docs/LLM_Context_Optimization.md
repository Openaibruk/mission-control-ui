# LLM Context Optimization & Cost Reduction

When operating a Multi-Agent AI architecture like OpenClaw, token costs and latency (Time-to-First-Token) can skyrocket if every agent reads the entire workspace context on every single turn.

To make replies lightning fast and extremely cheap, we employ the following optimization strategies:

## 1. Prompt Caching (The 90% Cost Reduction Strategy)
Major LLM providers (Anthropic Claude 3.5, Gemini 1.5 Pro, and soon OpenAI) now support **Prompt Caching**. 
*   **How it works:** Instead of paying for the LLM to read `AGENTS.md`, `TOOLS.md`, and `IDENTITY.md` every single time you send a message, the provider caches the beginning of the system prompt in their RAM for 5-60 minutes.
*   **The Rule:** Keep the large, static files (System Prompts, Rules, Tool Definitions) exactly the same and at the *very top* of the context window.
*   **The Benefit:** Cache hits are processed in milliseconds instead of seconds, and cached input tokens cost 50% to 90% less.

## 2. Strict RAG & Vector Memory (Bounded Contexts)
Never inject full markdown files from the `domains/` or `memory/` folders into an agent's active prompt.
*   **The Rule:** If an agent needs historical context or business logic, they must use the `memory_search` (Full Text Search/Vector Search) tool to query the database.
*   **The Benefit:** The agent only pulls the specific 5-10 lines of context it actually needs, rather than dumping a 10,000-word SOP document into its context window. This prevents "Lost in the Middle" syndrome and saves massive token overhead.

## 3. Tiered Model Routing
Not every task requires a 70B parameter model.
*   **Small/Fast Models (e.g., `step-3.5-flash:free`, `gemini-3.1-flash:free`):** Use these for background cron jobs, parsing incoming emails, checking the Supabase status, and simple routing. These are virtually instantaneous and cost nothing.
*   **Large/Complex Models (e.g., `claude-opus-4.6`, `llama-3.3-70b`):** Only route to these models when writing complex code, performing deep logic analysis, or drafting final executive presentations.

## 4. Semantic Caching
If an agent is asked the exact same question repeatedly (e.g., "What is the B2B snapshot for today?"), the system should cache the generated answer for 24 hours rather than re-running the LLM chain.

By enforcing these four rules, OpenClaw stays blazingly fast and token-efficient.
