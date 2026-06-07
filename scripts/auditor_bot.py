import asyncio
import os
import sys

# Ensure the project root is in the path to read config if needed
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from google.antigravity import Agent, LocalAgentConfig

# We will read the syllabus.ts file and pass it to the agent
SYLLABUS_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src", "config", "syllabus.ts")

AUDITOR_PROMPT = """
You are the Impartial Curriculum Auditor for notZekeAcademy.
Your job is to read the provided syllabus configuration file (in TypeScript/JSON format) and rigorously evaluate it for:
1. Factual accuracy (e.g. are the classifications correct in the real world?).
2. Logical consistency (do the concepts match the categories?).
3. Potential LLM hallucination drift (does any concept seem fabricated or bizarre?).

You must output a structured validation report in Markdown format.
For each Level, list out any warnings, errors, or confirm that it is verified.
"""

async def main():
    if not os.path.exists(SYLLABUS_PATH):
        print(f"Error: Syllabus file not found at {SYLLABUS_PATH}")
        return

    with open(SYLLABUS_PATH, "r") as f:
        syllabus_content = f.read()

    print("Initializing the Impartial Curriculum Auditor...")
    
    # Configure the agent
    config = LocalAgentConfig(
        system_instruction=AUDITOR_PROMPT,
        model="gemini-2.5-pro" # Use the pro model for advanced reasoning
    )

    try:
        async with Agent(config) as agent:
            print("Auditing the curriculum... Please wait.\n")
            
            prompt = f"Please audit the following syllabus configuration:\n\n```typescript\n{syllabus_content}\n```"
            
            response = await agent.chat(prompt)
            report_content = await response.text()
            
            report_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "audit_report.md")
            with open(report_path, "w") as f:
                f.write(report_content)
                
            print(f"\nAudit complete! Report saved to {report_path}")
    except Exception as e:
        print(f"Error running auditor: {e}")

if __name__ == "__main__":
    asyncio.run(main())
