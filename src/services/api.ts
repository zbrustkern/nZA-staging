import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";
import { LevelConfig } from "../config/syllabus";

export const generateTutoringHint = async (levelConfig: LevelConfig, userAnswer: Record<string, string>, conceptFailed: string) => {
  try {
    const generateHint = httpsCallable(functions, "generate_tutoring_hint");
    const result = await generateHint({ level_config: levelConfig, user_answer: userAnswer, concept_failed: conceptFailed });
    return result.data as { hint: string };
  } catch (error) {
    console.error("Error calling generate_tutoring_hint function", error);
    throw error;
  }
};

export const generateRemedialLevel = async (levelConfig: LevelConfig, conceptFailed: string) => {
  try {
    const generateLevel = httpsCallable(functions, "generate_remedial_level");
    const result = await generateLevel({ level_config: levelConfig, concept_failed: conceptFailed });
    return result.data as { level: LevelConfig };
  } catch (error) {
    console.error("Error calling generate_remedial_level function", error);
    throw error;
  }
};
