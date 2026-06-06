import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export const evaluateLevel1 = async (userAnswer: Record<string, "Fact" | "Dimension">) => {
  try {
    const evaluateResponse = httpsCallable(functions, "evaluate_response");
    const result = await evaluateResponse({ user_answer: userAnswer });
    return result.data as { is_correct: boolean; error_type: string | null; concept_failed: string | null };
  } catch (error) {
    console.error("Error calling evaluate_response function", error);
    throw error;
  }
};
