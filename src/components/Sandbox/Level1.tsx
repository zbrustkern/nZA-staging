import { useState, DragEvent, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Divider, Spinner } from "@nextui-org/react";
import { generateTutoringHint, generateRemedialLevel } from '../../services/api';
import { LEVEL_1_CONFIG, LevelConfig, ConceptCategory, SYLLABUS_MAP } from '../../config/syllabus';

export default function Level1() {
  const [levelConfig, setLevelConfig] = useState<LevelConfig>(LEVEL_1_CONFIG);
  const [answers, setAnswers] = useState<Record<string, ConceptCategory>>({});
  const [loadingHint, setLoadingHint] = useState(false);
  const [loadingRemedial, setLoadingRemedial] = useState(false);
  const [result, setResult] = useState<{ is_correct: boolean; concept_failed: string | null; hint: string | null } | null>(null);

  useEffect(() => {
    setAnswers({});
    setResult(null);
  }, [levelConfig]);

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
    if (Object.keys(answers).length !== levelConfig.concepts.length) {
      alert("Please categorize all items before submitting.");
      return;
    }

    setResult(null);
    let failedConceptId: string | null = null;
    let failedConceptName: string | null = null;
    let correctCount = 0;

    for (const concept of levelConfig.concepts) {
      if (answers[concept.id] === concept.category) {
        correctCount++;
      } else if (!failedConceptId) {
        failedConceptId = concept.id;
        failedConceptName = concept.name;
      }
    }

    const score = correctCount / levelConfig.concepts.length;
    const passed = score >= levelConfig.passingThreshold;

    if (passed) {
      setResult({ is_correct: true, concept_failed: null, hint: null });
      return;
    }

    setLoadingHint(true);
    try {
      const { hint } = await generateTutoringHint(levelConfig, answers, failedConceptId!);
      setResult({ is_correct: false, concept_failed: failedConceptName, hint });
    } catch (err) {
      console.error(err);
      alert("Error generating hint.");
    } finally {
      setLoadingHint(false);
    }
  };

  const handleRemedial = async () => {
    if (!result?.concept_failed) return;
    setLoadingRemedial(true);
    try {
      const { level } = await generateRemedialLevel(levelConfig, result.concept_failed);
      setLevelConfig(level);
    } catch (err) {
      console.error(err);
      alert("Error generating remedial lesson.");
    } finally {
      setLoadingRemedial(false);
    }
  };

  const handleNextLesson = () => {
    if (levelConfig.nextLevelId && SYLLABUS_MAP[levelConfig.nextLevelId]) {
      setLevelConfig(SYLLABUS_MAP[levelConfig.nextLevelId]);
    }
  };

  const unassigned = levelConfig.concepts.filter(c => !answers[c.id]);

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full mt-8 mb-16">
      <h2 className="text-2xl font-bold text-center">{levelConfig.title}</h2>
      <p className="text-center text-gray-500 mb-2">{levelConfig.description}</p>

      {/* Render pedagogical lesson content if it exists */}
      {levelConfig.lessonHtml && (
        <Card className="bg-slate-50 border border-slate-200 shadow-sm mb-4">
          <CardBody>
            <div 
              className="text-gray-700 leading-relaxed text-left px-4"
              dangerouslySetInnerHTML={{ __html: levelConfig.lessonHtml }} 
            />
          </CardBody>
        </Card>
      )}

      <div className="flex justify-center gap-4 flex-wrap mb-4 min-h-[50px]">
        {unassigned.map(concept => (
          <div
            key={concept.id}
            draggable
            onDragStart={(e) => handleDragStart(e, concept.id)}
            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg shadow cursor-grab active:cursor-grabbing hover:bg-blue-200 transition"
          >
            {concept.name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {levelConfig.categories.map(category => {
          const categorizedConcepts = levelConfig.concepts.filter(c => answers[c.id] === category);
          return (
            <Card key={category} className="w-full">
              <CardHeader className={`font-bold text-lg justify-center ${category === 'Fact' || category === 'Surrogate Key' ? 'bg-orange-100' : 'bg-purple-100'}`}>
                {category}s
              </CardHeader>
              <Divider/>
              <CardBody 
                className="min-h-[250px] flex flex-col items-center gap-2 bg-slate-50"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, category)}
              >
                {categorizedConcepts.length === 0 && <span className="text-gray-400 mt-4">Drag & Drop {category}s here</span>}
                {categorizedConcepts.map(concept => (
                  <div 
                    key={concept.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, concept.id)}
                    className={`px-4 py-2 border rounded w-full text-center shadow-sm cursor-grab ${
                      category === 'Fact' || category === 'Surrogate Key' ? 'bg-orange-100 border-orange-300 text-orange-800' : 'bg-purple-100 border-purple-300 text-purple-800'
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

      <div className="flex justify-center mt-4">
        <Button 
          color="primary" 
          size="lg" 
          onClick={handleSubmit} 
          isDisabled={Object.keys(answers).length !== levelConfig.concepts.length || loadingHint || loadingRemedial}
          className="shadow-lg"
        >
          {loadingHint ? <Spinner color="white" size="sm" /> : "Submit Answer"}
        </Button>
      </div>

      {result && (
        <Card className={`mt-4 ${result.is_correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <CardBody>
            <div className="flex justify-between items-center">
              <h3 className={`text-lg font-bold ${result.is_correct ? 'text-green-700' : 'text-red-700'}`}>
                {result.is_correct ? "🎉 Perfect! You mastered this concept." : "Needs Work"}
              </h3>
              
              {/* UX FLOW: Next Lesson Button */}
              {result.is_correct && levelConfig.nextLevelId && SYLLABUS_MAP[levelConfig.nextLevelId] && (
                <Button color="success" onClick={handleNextLesson}>
                  Continue to Next Lesson →
                </Button>
              )}
            </div>
            
            {!result.is_correct && (
              <div className="mt-4 text-gray-800 flex flex-col gap-4">
                <div>
                  <p className="font-semibold mb-1 text-red-800">Review: {result.concept_failed}</p>
                  <div className="bg-white/60 p-4 rounded-lg border border-red-100 text-md leading-relaxed">
                    {result.hint}
                  </div>
                </div>
                
                <div className="mt-2 flex justify-end">
                  <Button 
                    color="secondary" 
                    variant="flat" 
                    onClick={handleRemedial}
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
