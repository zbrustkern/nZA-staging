import { useState, DragEvent, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Divider, Spinner, Progress } from "@nextui-org/react";
import { generateTutoringHint, generateRemedialLevel, generateRemedialUnit } from '../../services/api';
import { UNIT_1_DIMENSIONAL_BASICS, Unit, Lesson, ConceptCategory } from '../../config/syllabus';
import { CheckCircle2 } from 'lucide-react';

export default function UnitViewer() {
  const [unit, setUnit] = useState<Unit>(UNIT_1_DIMENSIONAL_BASICS);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  
  // Tracking Multi-Tiered Evaluation
  const [totalUnitFailures, setTotalUnitFailures] = useState(0);
  const [currentLessonFailures, setCurrentLessonFailures] = useState(0);
  
  const currentLesson: Lesson = unit.lessons[currentLessonIndex];
  const isUnitComplete = currentLessonIndex >= unit.lessons.length;

  const [answers, setAnswers] = useState<Record<string, ConceptCategory>>({});
  const [loadingHint, setLoadingHint] = useState(false);
  const [loadingRemedial, setLoadingRemedial] = useState(false);
  const [result, setResult] = useState<{ is_correct: boolean; concept_failed: string | null; hint: string | null } | null>(null);

  useEffect(() => {
    setAnswers({});
    setResult(null);
    setCurrentLessonFailures(0); // Reset lesson failures on new lesson
  }, [currentLessonIndex, unit.id]);

  if (isUnitComplete) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full mt-16 text-center animate-in zoom-in duration-500">
        <div className="flex justify-center mb-4 text-green-500">
          <CheckCircle2 size={80} />
        </div>
        <h2 className="text-4xl font-bold text-slate-800">Unit Complete!</h2>
        <p className="text-xl text-slate-600">You have successfully mastered {unit.title} with {totalUnitFailures} total mistakes.</p>
        <div className="mt-8">
          <Button color="primary" size="lg" onClick={() => {
            window.location.reload();
          }}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>, category: ConceptCategory) => {
    e.preventDefault();
    const item = e.dataTransfer.getData("text/plain");
    if (item) {
      setAnswers(prev => ({ ...prev, [item]: category }));
    }
  };

  const handleDragStart = (e: DragEvent<HTMLDivElement>, item: string) => {
    e.dataTransfer.setData("text/plain", item);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (!currentLesson.exercise) return;
    
    if (Object.keys(answers).length !== currentLesson.exercise.concepts.length) {
      alert("Please categorize all items before submitting.");
      return;
    }

    setResult(null);
    let failedConceptId: string | null = null;
    let failedConceptName: string | null = null;
    let correctCount = 0;

    for (const concept of currentLesson.exercise.concepts) {
      if (answers[concept.id] === concept.category) {
        correctCount++;
      } else if (!failedConceptId) {
        failedConceptId = concept.id;
        failedConceptName = concept.name;
      }
    }

    const score = correctCount / currentLesson.exercise.concepts.length;
    const passed = score >= currentLesson.exercise.passingThreshold;

    if (passed) {
      setResult({ is_correct: true, concept_failed: null, hint: null });
      return;
    }

    // Determine deterministic AI trigger based on failure counts
    const newLessonFailures = currentLessonFailures + 1;
    const newTotalUnitFailures = totalUnitFailures + 1;
    
    setCurrentLessonFailures(newLessonFailures);
    setTotalUnitFailures(newTotalUnitFailures);

    // THRESHOLD 3: Foundational Disconnect (Unit Level Remediation)
    if (newTotalUnitFailures >= 5) {
        setLoadingRemedial(true);
        try {
            const { lesson } = await generateRemedialUnit(unit);
            // Replace the rest of the unit with the macro review
            const newUnit = { ...unit };
            newUnit.lessons.splice(currentLessonIndex + 1, newUnit.lessons.length - (currentLessonIndex + 1), lesson as any);
            setUnit(newUnit);
            setCurrentLessonIndex(currentLessonIndex + 1);
            setTotalUnitFailures(0); // Reset to give them a fresh start on the macro review
        } catch (err) {
            console.error(err);
            alert("Error generating macro-level unit review.");
        } finally {
            setLoadingRemedial(false);
        }
        return;
    }

    // THRESHOLD 2: Concept Blockage (Lesson Level Remediation)
    if (newLessonFailures >= 3) {
        setLoadingRemedial(true);
        try {
            const { level } = await generateRemedialLevel(currentLesson as any, failedConceptName || "Concept");
            const newUnit = { ...unit };
            newUnit.lessons.splice(currentLessonIndex + 1, 0, level as any);
            setUnit(newUnit);
            setCurrentLessonIndex(currentLessonIndex + 1);
        } catch (err) {
            console.error(err);
            alert("Error generating remedial lesson.");
        } finally {
            setLoadingRemedial(false);
        }
        return;
    }

    // THRESHOLD 1: Minor Misunderstanding (Exercise Level Hint)
    setLoadingHint(true);
    try {
      const { hint } = await generateTutoringHint(currentLesson as any, answers, failedConceptId!);
      setResult({ is_correct: false, concept_failed: failedConceptName, hint });
    } catch (err) {
      console.error(err);
      alert("Error generating hint.");
    } finally {
      setLoadingHint(false);
    }
  };

  const handleManualRemedial = async () => {
    if (!result?.concept_failed) return;
    setLoadingRemedial(true);
    try {
      const { level } = await generateRemedialLevel(currentLesson as any, result.concept_failed);
      
      const newUnit = { ...unit };
      newUnit.lessons.splice(currentLessonIndex + 1, 0, level as any);
      setUnit(newUnit);
      
      setCurrentLessonIndex(currentLessonIndex + 1);
    } catch (err) {
      console.error(err);
      alert("Error generating remedial lesson.");
    } finally {
      setLoadingRemedial(false);
    }
  };

  const handleNextLesson = () => {
    setCurrentLessonIndex(prev => prev + 1);
  };

  const unassigned = currentLesson.exercise ? currentLesson.exercise.concepts.filter(c => !answers[c.id]) : [];
  const progressValue = ((currentLessonIndex) / unit.lessons.length) * 100;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full mt-4 mb-16">
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-500 mb-2 font-medium">
          <span>{unit.title}</span>
          <span>Lesson {currentLessonIndex + 1} of {unit.lessons.length}</span>
        </div>
        <Progress value={progressValue} color="primary" className="h-2" />
      </div>

      <h2 className="text-3xl font-bold text-center text-slate-800">{currentLesson.title}</h2>
      <p className="text-center text-slate-500 mb-2 text-lg">{currentLesson.description}</p>

      {/* Render pedagogical lesson content if it exists */}
      {currentLesson.lessonHtml && (
        <Card className="bg-white border border-slate-200 shadow-sm mb-4">
          <CardBody className="p-8">
            <div 
              className="text-slate-700 leading-relaxed text-left text-lg"
              dangerouslySetInnerHTML={{ __html: currentLesson.lessonHtml }} 
            />
          </CardBody>
        </Card>
      )}

      {currentLesson.exercise && (
        <div className="animate-in fade-in duration-700 mt-4">
          <div className="flex justify-center gap-4 flex-wrap mb-6 min-h-[50px]">
            {unassigned.map(concept => (
              <div
                key={concept.id}
                draggable
                onDragStart={(e) => handleDragStart(e, concept.id)}
                className="px-5 py-3 bg-blue-100 text-blue-900 font-medium rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:bg-blue-200 hover:shadow-md transition-all"
              >
                {concept.name}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentLesson.exercise.categories.map(category => {
              const categorizedConcepts = currentLesson.exercise!.concepts.filter(c => answers[c.id] === category);
              return (
                <Card key={category} className="w-full border-none shadow-md">
                  <CardHeader className={`font-bold text-xl justify-center py-4 ${category === 'Fact' || category === 'Surrogate Key' ? 'bg-orange-100 text-orange-900' : 'bg-purple-100 text-purple-900'}`}>
                    {category}s
                  </CardHeader>
                  <Divider/>
                  <CardBody 
                    className="min-h-[300px] flex flex-col items-center gap-3 bg-slate-50 p-6"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, category)}
                  >
                    {categorizedConcepts.length === 0 && <span className="text-slate-400 mt-8 text-lg border-2 border-dashed border-slate-300 rounded-xl p-8 w-full text-center">Drag & Drop {category}s here</span>}
                    {categorizedConcepts.map(concept => (
                      <div 
                        key={concept.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, concept.id)}
                        className={`px-5 py-3 border-2 rounded-xl w-full text-center font-medium shadow-sm cursor-grab transition-all ${
                          category === 'Fact' || category === 'Surrogate Key' ? 'bg-orange-50 border-orange-200 text-orange-800 hover:border-orange-400' : 'bg-purple-50 border-purple-200 text-purple-800 hover:border-purple-400'
                        }`}
                      >
                        {concept.name}
                      </div>
                    ))}
                  </CardBody>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center mt-8">
            <Button 
              color="primary" 
              size="lg" 
              className="px-12 py-6 text-lg font-bold shadow-xl"
              onClick={handleSubmit} 
              isDisabled={Object.keys(answers).length !== currentLesson.exercise.concepts.length || loadingHint || loadingRemedial}
            >
              {loadingHint || loadingRemedial ? <Spinner color="white" size="sm" /> : "Submit Answer"}
            </Button>
          </div>
        </div>
      )}

      {/* No Exercise State */}
      {!currentLesson.exercise && (
        <div className="flex justify-center mt-8">
           <Button color="success" size="lg" className="px-12 py-6 text-lg font-bold shadow-xl text-white" onClick={handleNextLesson}>
              Continue to Next Lesson →
            </Button>
        </div>
      )}

      {result && (
        <Card className={`mt-8 border-2 ${result.is_correct ? 'bg-green-50 border-green-400 shadow-green-100' : 'bg-red-50 border-red-300 shadow-red-100'} shadow-xl animate-in slide-in-from-bottom-4 duration-500`}>
          <CardBody className="p-6">
            <div className="flex justify-between items-center">
              <h3 className={`text-2xl font-bold flex items-center gap-2 ${result.is_correct ? 'text-green-800' : 'text-red-800'}`}>
                {result.is_correct ? <><CheckCircle2 /> Perfect! You mastered this concept.</> : "Needs Work"}
              </h3>
              
              {/* UX FLOW: Next Lesson Button */}
              {result.is_correct && (
                <Button color="success" size="lg" className="font-bold text-white shadow-md" onClick={handleNextLesson}>
                  Continue to Next Lesson →
                </Button>
              )}
            </div>
            
            {!result.is_correct && (
              <div className="mt-6 text-slate-800 flex flex-col gap-6">
                <div>
                  <p className="font-bold mb-2 text-red-900 text-lg">Review: {result.concept_failed}</p>
                  <div className="bg-white p-6 rounded-xl border border-red-100 text-lg leading-relaxed shadow-sm">
                    {result.hint}
                  </div>
                </div>
                
                <div className="mt-2 flex justify-end">
                  <Button 
                    color="secondary" 
                    variant="flat"
                    size="lg" 
                    className="font-semibold"
                    onClick={handleManualRemedial}
                    isDisabled={loadingRemedial}
                  >
                    {loadingRemedial ? <Spinner color="secondary" size="sm" /> : "Try a New Scenario"}
                  </Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
