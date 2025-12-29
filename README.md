# X-Ray: Decision-Centric Observability SDK

**X-Ray** is a lightweight, domain-agnostic observability framework designed to solve the "Black Box" problem in non-deterministic pipelines. While traditional logs tell you *what* the system did, X-Ray tells you **why** it did it.

## 🚀 Setup Instructions

### 1. Prerequisites

* **Node.js**: 18.x or later
* **npm/yarn**: Standard package managers

### 2. Quick Start

```bash
# Clone the repository
git clone https://github.com/anujmajumdar/x-ray-app-mvp
cd x-ray-app-mvp

# Install dependencies
npm install

# Start the development server
npm run dev

```

### 3. Usage

1. **View the Dashboard**: Navigate to [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000).
2. **Run the Demo**: Click **"Run Demo Workflow"** to execute the test suite. This triggers several categories (Water Bottles, Laptops, etc.) with simulated success and failure states.

---

## 💡 Technical Approach

### 1. The "Step" Abstraction (`lib/xray-sdk.ts`)

The core of the SDK is the `.step()` method. This wraps business logic in a managed execution block that handles:

* **Error Boundaries**: Captures failures (timeouts, API errors) at the step level, marking the trace as `failed` while preserving all context gathered up to that point.
* **Reasoning Injection**: Provides a dedicated channel for "Internal Reasoning" strings, perfect for capturing LLM Chain-of-Thought or complex heuristic justifications.
* **Decision Matrix**: An `evaluations` array that logs the fate of every candidate item (e.g., "Why was this product dropped?").

### 2. Multi-Category Test Suite (`lib/demo-test-cases.ts`)

To demonstrate the "General Purpose" nature of the library, the demo includes:

* **Diverse Domains**: Water Bottles, Laptops, Headphones, Smart Watches, and Keyboards.
* **Simulated Failure States**: Specific cases are hardwired to fail at different stages (e.g., LLM timeout at Step 1 vs. Filter elimination at Step 3).
* **Sophisticated Ranking**: A 5-step pipeline including Keyword Gen, Mock API Search, Heuristic Filtering, LLM Relevance Scoring, and Weighted Composite Ranking.

### 3. Isomorphic Data Persistence (`lib/storage.ts`)

I implemented a shared memory storage strategy that works across both Server and Client components in Next.js. This ensures that traces generated via Server Actions or API routes are immediately visible in the Dashboard without requiring an external database setup.

---

## 🔍 Dashboard Features

* **Failure Visualization**: Failed steps are highlighted in red with explicit error messages.
* **Funnel Analysis**: Visualizes the "Decision Matrix," making it easy to see which specific business rule (Price, Rating, or Popularity) caused a candidate to be eliminated.
* **Semantic Scoring**: Displays LLM-generated relevance scores, moving beyond simple keyword matching to show true intent.

---

## 🚧 Known Limitations & Future Improvements

### Current Limitations

* **Volatility**: Traces are stored in-memory; restarting the development server will clear the history.
* **Linearity**: The SDK currently visualizes sequential steps; it does not yet represent parallel branching logic (e.g., `Promise.all` scenarios).

### Future Improvements

* **Persistent Storage**: Migration to a Postgres/JSONB backend to allow for historical trend analysis.
* **Replay & Debug**: Adding a "Re-run Step" button that allows developers to tweak logic (like price thresholds) and re-execute a step using the exact cached input.
* **Diffing Tool**: A side-by-side comparison view to see why two similar inputs produced different outputs.

---
