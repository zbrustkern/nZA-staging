import { doc, getDoc, setDoc, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase";

export interface UserProgress {
  currentUnitId: string;
  currentLessonIndex: number;
  totalUnitFailures: number;
  currentLessonFailures: number;
  completedUnitIds?: string[];
}

// Persist or update user state
export const syncUserProgress = async (progress: UserProgress) => {
  if (!auth.currentUser) return;
  const userRef = doc(db, "users", auth.currentUser.uid);
  try {
    // Merge true allows us to create it if it doesn't exist, or update if it does
    await setDoc(userRef, progress, { merge: true });
  } catch (error) {
    console.error("Error syncing user progress:", error);
  }
};

// Fetch initial state on load
export const getUserProgress = async (): Promise<UserProgress | null> => {
  if (!auth.currentUser) return null;
  const userRef = doc(db, "users", auth.currentUser.uid);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProgress;
    }
    return null;
  } catch (error) {
    console.error("Error getting user progress:", error);
    return null;
  }
};

export interface TelemetryFailure {
  conceptId: string;
  conceptName: string;
  unitId: string;
  lessonId: string;
  timestamp: any;
}

// Log a failure event
export const logTelemetryFailure = async (conceptId: string, conceptName: string, unitId: string, lessonId: string) => {
  if (!auth.currentUser) return;
  const telemetryRef = collection(db, "telemetry_failures");
  try {
    await addDoc(telemetryRef, {
      conceptId,
      conceptName,
      unitId,
      lessonId,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Error logging telemetry failure:", error);
  }
};

// Get aggregated telemetry data
export const getTelemetryData = async () => {
  if (!auth.currentUser) return [];
  const telemetryRef = collection(db, "telemetry_failures");
  try {
    // Simple query, in a real app you might want to aggregate on the backend or use Cloud Functions to maintain counters
    const q = query(telemetryRef, orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    const failures: TelemetryFailure[] = [];
    snapshot.forEach((doc) => {
      failures.push(doc.data() as TelemetryFailure);
    });
    return failures;
  } catch (error) {
    console.error("Error getting telemetry data:", error);
    return [];
  }
};
