import json
from firebase_functions import https_fn, options
from firebase_admin import initialize_app, firestore
from google import genai
from google.genai import types

# Initialize Firebase Admin
initialize_app()

# Define the Secret reference for the API key
gemini_api_key = options.SecretParam("GEMINI_API_KEY")

@https_fn.on_call(secrets=[gemini_api_key], region="us-central1")
def evaluate_response(req: https_fn.CallableRequest) -> dict:
    """
    Evaluates a user's answer against the perfect solution for Level 1.
    """
    if not req.auth:
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.UNAUTHENTICATED,
            message="User must be authenticated to use this feature."
        )

    data = req.data
    user_answer = data.get("user_answer")
    
    if not user_answer:
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INVALID_ARGUMENT,
            message="user_answer is required."
        )

    # System Instructions for the evaluation loop
    system_instruction = (
        "You are an expert Data Engineering instructor. The user is playing a game to learn "
        "dimensional modeling. In Level 1, they must categorize concepts into 'Fact' or 'Dimension'.\n"
        "Perfect Solution:\n"
        "- Sales Amount: Fact\n"
        "- Customer Name: Dimension\n"
        "- Transaction Date: Dimension\n"
        "- Discount Applied: Fact\n"
        "- Store Location: Dimension\n"
        "Evaluate their answer based strictly on the perfect solution.\n"
        "Output a strict JSON object with these exact keys:\n"
        "- `is_correct`: boolean (true if 100% correct, false otherwise)\n"
        "- `error_type`: string description of why they failed, or null if correct\n"
        "- `concept_failed`: the specific item they got wrong (e.g. 'Sales Amount'), or null if correct."
    )

    try:
        # Initialize the GenAI client with the secret key securely fetched at runtime
        client = genai.Client(api_key=gemini_api_key.value)

        prompt = f"User Answer: {json.dumps(user_answer)}"

        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                temperature=0.0
            ),
        )

        result = json.loads(response.text)
        
        # Save the interaction to Firestore for telemetry/progress tracking
        db = firestore.client()
        user_ref = db.collection("users").document(req.auth.uid)
        progress_ref = user_ref.collection("progress").document("level_1")
        
        progress_ref.set({
            "last_evaluation": result,
            "is_completed": result.get("is_correct", False),
            "timestamp": firestore.SERVER_TIMESTAMP
        }, merge=True)

        return result
        
    except Exception as e:
        print(f"Error evaluating response: {e}")
        raise https_fn.HttpsError(
            code=https_fn.FunctionsErrorCode.INTERNAL,
            message="Failed to evaluate response."
        )
