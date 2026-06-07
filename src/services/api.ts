import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";
import { Lesson, Unit } from "../config/syllabus";

export const generateTutoringHint = async (lesson: Lesson, userAnswer: Record<string, string>, conceptFailed: string) => {
  try {
    const generateHint = httpsCallable(functions, "generate_tutoring_hint");
    const result = await generateHint({ level_config: lesson, user_answer: userAnswer, concept_failed: conceptFailed });
    return result.data as { hint: string };
  } catch (error) {
    console.error("Error calling generate_tutoring_hint function", error);
    throw error;
  }
};

export const generateRemedialLevel = async (lesson: Lesson, conceptFailed: string) => {
  try {
    const generateLevel = httpsCallable(functions, "generate_remedial_level");
    const result = await generateLevel({ level_config: lesson, concept_failed: conceptFailed });
    return result.data as { level: Lesson };
  } catch (error) {
    console.error("Error calling generate_remedial_level function", error);
    throw error;
  }
};

export const generateRemedialUnit = async (unit: Unit) => {
  try {
    const generateUnit = httpsCallable(functions, "generate_remedial_unit");
    const result = await generateUnit({ unit });
    return result.data as { lesson: Lesson };
  } catch (error) {
    console.error("Error calling generate_remedial_unit function", error);
    throw error;
  }
};
