# notZekeAcademy (Staging)

Welcome to the **nZA-Staging** environment, the core staging framework for the notZekeAcademy learning platform.

## Architecture: The Scalable Learning Framework

Unlike traditional hardcoded courses, nZA operates as a **Generic Rules Engine** powered by an AI Tutor layer.

1. **Deterministic Evaluation (Zero Latency)**: The React client parses a JSON/TypeScript syllabus and evaluates answers instantaneously and locally. If a student understands the concept, there are zero network calls and zero AI costs.
2. **AI Intervention Tutor**: If a student struggles, the client invokes our Firebase Cloud Functions middleware. The AI parses the exact failed concept and generates a Socratic, conversational hint.
3. **Dynamic Level Generation**: If a student hits a wall, the AI can "non-deterministically generate a deterministic lesson." It will generate a completely novel JSON schema for the same learning concept (e.g., swapping a retail scenario for a healthcare scenario), which the client then renders as a new static level.

## Getting Started

1. Set up your Google AI Studio API Key and authenticate with Firebase.
2. Store the key in Firebase Secret Manager: `npx firebase-tools functions:secrets:set GEMINI_API_KEY`
3. Run `npm install` and `npm run dev` to start the frontend.
4. Run `npx firebase-tools deploy --only functions` to deploy the AI Tutor middleware.

## The Impartial Curriculum Auditor

To prevent LLM hallucination drift in our syllabi, we use an automated agent built on the **Google Antigravity SDK**. 
Run `python3 scripts/auditor_bot.py` to spawn the impartial auditor. It will review all active curricula and output a validation report ensuring accuracy and logical consistency before any course reaches a student.