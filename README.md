# not Zeke Academy

Welcome to **not Zeke Academy**, a dynamic, AI-powered learning platform designed to help learners build and customize curricula for their unique needs. 

Through dynamic, GenAI-powered lesson building and learner-aware reactive pedagogy, not Zeke Academy breaks away from the static, rigid constraints of traditional e-learning.

**Live Demo:** [https://snipit-46a75.web.app/](https://snipit-46a75.web.app/)

---

## 🎯 Purpose and Goals

Education is not one-size-fits-all. When a student encounters a difficult concept, failing a static quiz and re-reading the exact same static text is an inefficient path to mastery.

**The goals of not Zeke Academy are to:**
1. **Democratize Curriculum Building**: Allow educators and learners to define generic syllabus schemas that the engine can seamlessly parse and render into interactive lessons.
2. **Provide Learner-Aware Interventions**: Intercept student failure at the exact point of misunderstanding and provide customized, Socratic tutoring via an AI middleware layer.
3. **Dynamically Generate Lessons**: Eradicate "dead ends." If a student cannot grasp a concept within a specific industry context (e.g., Retail Sales), the engine can autonomously generate a completely novel curriculum teaching the *exact same concepts* via a new context (e.g., Airline Bookings).

---

## 🏗️ Technical Architecture & Implementation Details

not Zeke Academy is built upon a **Scalable Learning Framework**, conceptually split into a Lightning-Fast Deterministic Client and an Advanced AI Middleware Backend.

### 1. The Client-Side Rules Engine (React + TypeScript)
- **Zero Latency Evaluation**: The UI runs entirely deterministically. It ingests strict `LevelConfig` JSON/TypeScript schemas (containing pedagogical content and drag-and-drop mechanics) and evaluates learner responses instantly in the browser. 
- **Zero Unnecessary AI Costs**: If a student successfully masters a concept on their first try, the platform issues zero network calls to the AI, ensuring the platform remains highly scalable and cost-effective.

### 2. AI Intervention Tutor (Firebase Cloud Functions + Google GenAI SDK)
- **Reactive Pedagogy**: If a student fails an evaluation, the React client bundles the exact concept they failed and the incorrect answers they provided, and ships it to our Firebase Cloud Functions.
- **Socratic Guidance**: The `generate_tutoring_hint` backend endpoint uses advanced Google GenAI models to parse the failure context and stream back a highly specific, conversational hint guiding the student to the answer without giving it away.

### 3. Dynamic GenAI Lesson Builder
- **Non-Deterministic Generation of Deterministic Code**: If a student exhausts their hints or requests a new perspective, the engine triggers the `generate_remedial_level` endpoint.
- **Strict Structured Outputs**: Using GenAI Structured Outputs, the AI generates a completely novel `LevelConfig` JSON payload—complete with new pedagogical HTML, entirely new interactive concepts, and new categories.
- **Seamless Injection**: The React client receives this newly generated payload and instantaneously hot-swaps the UI to render the brand-new interactive level.

### 4. The Impartial Curriculum Auditor (Google Antigravity SDK)
- To prevent LLM hallucination drift within our curriculum, the platform utilizes an automated background agent built on the **Google Antigravity SDK**. 
- This agent rigorously audits all `syllabus.ts` schemas for factual accuracy and logical consistency before they ever reach a student's screen.

---

## 📚 Curriculum Structure & Data Modeling

not Zeke Academy is designed so that future content creators can easily build and scale courses. We moved away from flat arrays and built a strict hierarchical schema (defined in \`src/config/syllabus.ts\`) that mirrors real-world educational paradigms:

1. **Track:** The highest level, representing a complete career path (e.g., *Data Engineering Track*). Contains an array of Courses.
2. **Course:** A major sub-discipline within a Track (e.g., *Dimensional Modeling & Pipelines*). Contains an array of Units.
3. **Unit:** A specific, logical grouping of related topics (e.g., *Unit 1: Dimensional Basics*). Contains an array of Lessons.
4. **Lesson:** A specific pedagogical block. It contains the actual educational reading material (\`lessonHtml\`) and a single, interactive **Exercise**.
5. **Exercise:** The interactive evaluation. It defines the \`uiType\` (e.g., Drag & Drop or Multiple Choice), passing thresholds, and an array of individual **Concepts** mapped to specific **Categories**.

---

## 🚀 Getting Started

1. Clone the repository and run `npm install`.
2. Secure your Google AI Studio API Key and authenticate your local Firebase CLI.
3. Store the key securely in the Firebase Secret Manager: 
   \`\`\`bash
   npx firebase-tools functions:secrets:set GEMINI_API_KEY
   \`\`\`
4. Run \`npm run dev\` to start the React frontend.
5. Run \`npx firebase-tools deploy --only functions\` to deploy the AI Tutor middleware.