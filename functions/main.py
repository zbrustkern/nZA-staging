import json
from firebase_functions import https_fn, options
from firebase_admin import initialize_app, firestore
from google import genai
from google.genai import types

# Initialize Firebase Admin
initialize_app()

# Define the Secret reference for the API key
gemini_api_key = options.SecretParam("GEMINI_API_KEY")

def check_auth(req: https_fn.CallableRequest):
    if not req.auth:
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.UNAUTHENTICATED,
            message="User must be authenticated to use this feature."
        )

def evaluate_lesson_json(client, lesson_text: str) -> tuple[bool, str]:
    """Adversarial QA Agent to evaluate generated content."""
    system_instruction = (
        "You are a strict Data Engineering QA Agent. Evaluate the provided JSON lesson against these rules:\n"
        "1. All concepts listed in the 'exercise' MUST be explicitly taught/mentioned in the 'lessonHtml' text.\n"
        "2. Concept names MUST be completely unique. No duplicate strings across concepts.\n"
        "Output ONLY valid JSON matching this schema: {\"passed\": boolean, \"critique\": \"If passed is false, explain why concisely.\"}"
    )
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=lesson_text,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                temperature=0.1
            ),
        )
        res_json = json.loads(response.text)
        return res_json.get("passed", False), res_json.get("critique", "")
    except Exception as e:
        print(f"QA Error: {e}")
        return True, ""  # Fail open if QA agent crashes or returns bad JSON

@https_fn.on_call(secrets=[gemini_api_key], region="us-central1")
def generate_tutoring_hint(req: https_fn.CallableRequest) -> dict:
    check_auth(req)
    data = req.data
    level_config = data.get("level_config")
    user_answer = data.get("user_answer")
    concept_failed = data.get("concept_failed")

    if not level_config or not concept_failed:
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT, 
            message="Missing required fields."
        )

    system_instruction = (
        "You are an expert Data Engineering tutor. The user is playing a game to learn dimensional modeling. "
        f"They just failed the concept: '{concept_failed}'. "
        "Your goal is to provide a brief, conversational hint explaining why their answer is wrong "
        "and guiding them to the correct answer WITHOUT just giving them the answer directly. "
        "Keep it under 3 sentences."
    )

    try:
        client = genai.Client(api_key=gemini_api_key.value)
        prompt = f"Level Config: {json.dumps(level_config)}\nUser's incorrect categorization: {json.dumps(user_answer)}"

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.7
            ),
        )

        # Log intervention
        db = firestore.client()
        db.collection("users").document(req.auth.uid).collection("interventions").add({
            "level_id": level_config.get("id"),
            "concept_failed": concept_failed,
            "hint_provided": response.text,
            "timestamp": firestore.SERVER_TIMESTAMP
        })

        return {"hint": response.text}
    except Exception as e:
        print(f"Error generating hint: {e}")
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INTERNAL, 
            message="Failed to generate hint."
        )

@https_fn.on_call(secrets=[gemini_api_key], region="us-central1")
def generate_remedial_level(req: https_fn.CallableRequest) -> dict:
    check_auth(req)
    data = req.data
    level_config = data.get("level_config")
    concept_failed = data.get("concept_failed")

    if not level_config or not concept_failed:
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT, 
            message="Missing required fields."
        )

    system_instruction = (
        "You are an expert curriculum designer. The user struggled with the concept "
        f"'{concept_failed}' in the context of dimensional modeling. "
        "Generate a completely new, novel Lesson Configuration that teaches the SAME underlying concepts "
        "but uses a completely different industry scenario (e.g. Airline booking, Hospital visits, Streaming service). "
        "RULES:\n"
        "1. All topics tested in the exercise MUST be explicitly defined in the `lessonHtml`.\n"
        "2. Every concept name MUST be unique. No duplicate strings.\n"
        "3. Randomly alternate between 'drag_and_drop' and 'multiple_choice' for 'uiType'.\n"
        "The response MUST be a valid JSON object matching the Lesson schema: "
        "{'id': string, 'title': string, 'description': string, 'lessonHtml': string, 'exercise': "
        "{'uiType': 'drag_and_drop' | 'multiple_choice', 'passingThreshold': 1.0, 'categories': ['Fact', 'Dimension'], "
        "'concepts': [{'id': string, 'name': string, 'category': 'Fact'}]}} "
        "Ensure there are exactly 5 concepts."
    )

    try:
        client = genai.Client(api_key=gemini_api_key.value)
        prompt = f"Original Level Config: {json.dumps(level_config)}"
        
        max_attempts = 2
        for attempt in range(max_attempts):
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                    temperature=0.8
                ),
            )
            
            passed, critique = evaluate_lesson_json(client, response.text)
            if passed or attempt == max_attempts - 1:
                break
            else:
                print(f"QA Failed on attempt {attempt+1}: {critique}")
                prompt += f"\n\nYour previous attempt failed QA: {critique}\nPlease fix these errors."

        new_level = json.loads(response.text)
        if "id" not in new_level:
            new_level["id"] = f"remedial_{level_config.get('id', 'level')}"

        return {"level": new_level}
    except Exception as e:
        print(f"Error generating remedial level: {e}")
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INTERNAL, 
            message="Failed to generate remedial level."
        )

@https_fn.on_call(secrets=[gemini_api_key], region="us-central1")
def generate_remedial_unit(req: https_fn.CallableRequest) -> dict:
    check_auth(req)
    data = req.data
    unit = data.get("unit")

    if not unit:
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT, 
            message="Missing required field: unit."
        )

    system_instruction = (
        "You are an expert curriculum designer. The user has consistently failed multiple exercises across "
        f"the unit '{unit.get('title')}'. They are missing the foundational concepts. "
        "Generate a macro-level review Lesson that synthesizes all the concepts taught in this unit, "
        "providing a broad overview to bridge the conceptual gaps. "
        "RULES:\n"
        "1. All topics tested in the exercise MUST be explicitly defined in the `lessonHtml`.\n"
        "2. Every concept name MUST be unique. No duplicate strings.\n"
        "3. Randomly alternate between 'drag_and_drop' and 'multiple_choice' for 'uiType'.\n"
        "The response MUST be a valid JSON object matching the Lesson schema: "
        "{'id': string, 'title': string, 'description': string, 'lessonHtml': string, 'exercise': "
        "{'uiType': 'drag_and_drop' | 'multiple_choice', 'passingThreshold': 1.0, 'categories': ['Cat1', 'Cat2'], "
        "'concepts': [{'id': string, 'name': string, 'category': 'Cat1'}]}} "
        "Ensure the HTML lesson is highly encouraging and explains the big picture."
    )

    try:
        client = genai.Client(api_key=gemini_api_key.value)
        prompt = f"Failed Unit Configuration: {json.dumps(unit)}"

        max_attempts = 2
        for attempt in range(max_attempts):
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                    temperature=0.8
                ),
            )
            
            passed, critique = evaluate_lesson_json(client, response.text)
            if passed or attempt == max_attempts - 1:
                break
            else:
                print(f"QA Failed on attempt {attempt+1}: {critique}")
                prompt += f"\n\nYour previous attempt failed QA: {critique}\nPlease fix these errors."

        new_lesson = json.loads(response.text)
        if "id" not in new_lesson:
            new_lesson["id"] = f"remedial_unit_{unit.get('id', 'unit')}"

        return {"lesson": new_lesson}
    except Exception as e:
        print(f"Error generating remedial unit review: {e}")
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INTERNAL, 
            message="Failed to generate remedial unit review."
        )
