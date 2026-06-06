import { useState, DragEvent } from 'react';
import { Card, CardBody, CardHeader, Button, Divider, Spinner } from "@nextui-org/react";
import { evaluateLevel1 } from '../../services/api';

const items = [
  "Sales Amount",
  "Customer Name",
  "Transaction Date",
  "Discount Applied",
  "Store Location"
];

export default function Level1() {
  const [answers, setAnswers] = useState<Record<string, "Fact" | "Dimension">>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ is_correct: boolean; error_type: string | null; concept_failed: string | null } | null>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>, category: "Fact" | "Dimension") => {
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
    if (Object.keys(answers).length !== items.length) {
      alert("Please categorize all items before submitting.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await evaluateLevel1(answers);
      setResult(res);
    } catch (err) {
      console.error(err);
      alert("Error evaluating answer. Please ensure you are logged in and the server is running.");
    } finally {
      setLoading(false);
    }
  };

  const unassigned = items.filter(item => !answers[item]);
  const facts = Object.keys(answers).filter(item => answers[item] === "Fact");
  const dimensions = Object.keys(answers).filter(item => answers[item] === "Dimension");

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full mt-8">
      <h2 className="text-2xl font-bold text-center">Level 1: The Atomic Core</h2>
      <p className="text-center text-gray-500">Categorize the following items into Facts and Dimensions.</p>

      <div className="flex justify-center gap-4 flex-wrap mb-4 min-h-[50px]">
        {unassigned.map(item => (
          <div
            key={item}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg shadow cursor-grab active:cursor-grabbing hover:bg-blue-200 transition"
          >
            {item}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="w-full">
          <CardHeader className="bg-orange-100 font-bold text-lg justify-center">Facts</CardHeader>
          <Divider/>
          <CardBody 
            className="min-h-[250px] flex flex-col items-center gap-2 bg-slate-50"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "Fact")}
          >
            {facts.length === 0 && <span className="text-gray-400 mt-4">Drag & Drop Facts here</span>}
            {facts.map(item => (
              <div 
                key={item} 
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                className="px-4 py-2 bg-orange-100 border border-orange-300 text-orange-800 rounded w-full text-center shadow-sm cursor-grab"
              >
                {item}
              </div>
            ))}
          </CardBody>
        </Card>

        <Card className="w-full">
          <CardHeader className="bg-purple-100 font-bold text-lg justify-center">Dimensions</CardHeader>
          <Divider/>
          <CardBody 
            className="min-h-[250px] flex flex-col items-center gap-2 bg-slate-50"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "Dimension")}
          >
            {dimensions.length === 0 && <span className="text-gray-400 mt-4">Drag & Drop Dimensions here</span>}
            {dimensions.map(item => (
              <div 
                key={item} 
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                className="px-4 py-2 bg-purple-100 border border-purple-300 text-purple-800 rounded w-full text-center shadow-sm cursor-grab"
              >
                {item}
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <div className="flex justify-center mt-4">
        <Button 
          color="primary" 
          size="lg" 
          onClick={handleSubmit} 
          isDisabled={Object.keys(answers).length !== items.length || loading}
          className="shadow-lg"
        >
          {loading ? <Spinner color="white" size="sm" /> : "Submit Answer"}
        </Button>
      </div>

      {result && (
        <Card className={`mt-4 ${result.is_correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <CardBody>
            <h3 className={`text-lg font-bold ${result.is_correct ? 'text-green-700' : 'text-red-700'}`}>
              {result.is_correct ? "🎉 Perfect! You mastered the Atomic Core." : "Needs Work"}
            </h3>
            {!result.is_correct && (
              <div className="mt-2 text-gray-800">
                <p><strong>Failed Concept:</strong> {result.concept_failed}</p>
                <p><strong>Feedback:</strong> {result.error_type}</p>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
