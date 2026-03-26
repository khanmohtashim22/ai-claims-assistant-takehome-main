# Take-Home Challenge: AI Claims Review Assistant

## Overview

At Joyful, we recover revenue for healthcare practices by working denied and unpaid insurance claims. Our billers review claims, take actions (appeals, resubmissions, payer calls), and document their work — but many of these steps involve repetitive analysis that AI could assist with.

Your task is to build an **AI-powered claims review assistant** — an interactive webapp where an AI helps a billing specialist work through a queue of claims, with the human always in control of final decisions.

### Why Human-in-the-Loop Matters Here

Revenue cycle management is a domain where **mistakes are costly, actions have real side effects, and many decisions are one-way doors**. Filing an incorrect appeal can burn a deadline. Writing off a recoverable claim loses revenue permanently. Resubmitting with the wrong modifier can trigger an audit. The AI should be a powerful assistant, but the UX must reflect the high stakes: billers need to feel confident in what's happening, maintain control, and never be surprised by an action taken on their behalf.

We care deeply about how you think through these interaction patterns. Be deliberate about when and how the AI takes initiative, how the human stays in the loop, and what the experience feels like when things go wrong or need correction.

## Time Expectation

This challenge is designed to be completed in approximately **2–3 hours**. We value quality over quantity — a polished subset is preferred over a rough complete implementation. If you're running up against the time limit, prioritize depth over breadth — we'd rather see a thoughtful, well-considered implementation of the core interaction model than shallow coverage of all requirements.

## Constraints

- **AI usage is encouraged** — we expect candidates to use AI coding assistants. We care about the _decisions_ you make, not whether you typed every line.
- **Framework**: Your choice (React, Next.js, Svelte, Vue, etc.)
- **AI Provider**: Your choice — we suggest the [Vercel AI SDK](https://sdk.vercel.ai) as a good starting point, but OpenAI SDK, Anthropic SDK, LangChain, or any other approach is fine
- **Deployment**: Must be accessible via a public URL (Vercel, Netlify, Railway, Fly.io, etc.)
- You don't need a database — loading from the JSON file is fine

## Requirements

### Core

Build an interactive webapp with:

1. **AI Chat Interface**: A conversational UI where the user can discuss claims with an AI assistant that understands denial reasons, suggests next steps, and can help draft correspondence.

2. **Tool Calls**: The AI should be able to invoke at least **2–3 tools** that perform meaningful actions or retrieve information. What those tools are is up to you — think about what a biller actually needs when working a claim.

3. **Human-in-the-Loop Controls**: This is the heart of the challenge. The AI can analyze, suggest, and draft — but consequential actions require human confirmation. Think carefully about:

   - How the user knows what the AI is proposing vs. what has actually been done
   - How the conversation flow changes when the AI is waiting for a decision
   - How the user can modify, reject, or redirect the AI's suggestions
   - What happens when things go wrong or the user changes their mind

4. **Claims Dashboard**: A view showing the queue of claims and their statuses, that updates as the user works through them.

5. **Polished UI**: The app should feel like a real product. Good visual hierarchy, clear interaction patterns, and thoughtful use of space.

### Open-Ended Questions

In addition to the core requirements, consider the following. Pick **at least one** to address in your implementation, and discuss your thinking in your writeup:

- **Claim Organization**: In practice, billers are managing hundreds or thousands of claims at a time. How might you help them organize, prioritize, or navigate a large queue effectively?

- **Outcome Feedback**: The AI suggests next steps, but the right action isn't always obvious — and outcomes vary. How might you design a way for billers to give feedback on whether a suggested action actually worked, so the system (or a future version) could learn from it?

- **Workflow Feature**: What other workflow capability would make this tool meaningfully more useful for a biller's daily work? Identify one and implement it.

## Provided Data

See `claims.json` for 15 mock healthcare claims. Each claim includes:

- **Claim ID**, patient info, date of service, provider, and payer
- **CPT codes** (procedure codes) with billed/allowed/paid amounts
- **Claim status**: `denied`, `rejected`, `pending`, or `underpaid`
- **Denial/rejection reason and code**
- **Payer notes** explaining the denial in detail
- **Prior actions** taken on the claim (if any), with outcomes
- **Filing deadline** for appeals/resubmissions

## Deliverables

1. **Working code** pushed to a GitHub repo (can be a fork of this one or a new repo)
2. **Deployed app** accessible via a public URL
3. **Writeup** (~300–500 words, in this README or a separate doc) explaining:
   - How to run your solution locally
   - Technical choices and _why_
   - Product/design choices: how you approached the human-in-the-loop UX, what trade-offs you made, and what you'd improve with more time
   - Your thinking on the open-ended question(s) you chose

## Evaluation Criteria

We weight product thinking and UX design heavily. Specifically:

- **Human-in-the-Loop Design** (most important): Are the interaction patterns thoughtful given the constraints of RCM — costly mistakes, side effects, and irreversible actions? Does the UX keep the human genuinely in control, or just technically in the loop?
- **Product Thinking**: Does the app feel like something a billing specialist would actually want to use? Are the workflows intuitive?
- **AI Integration**: Are the tool calls well-scoped? Does the AI feel helpful without being dangerous?
- **Code Quality**: Clean, readable code with appropriate structure
- **Communication**: Clear articulation of decisions and trade-offs in your writeup

## Questions?

If anything is unclear, make a reasonable assumption and document it. We're interested in seeing how you approach ambiguity.

---

Good luck! We're excited to see your approach.
