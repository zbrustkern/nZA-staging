import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { getTelemetryData, TelemetryFailure } from '../../services/db';

export default function TelemetryViewer() {
  const [telemetry, setTelemetry] = useState<TelemetryFailure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTelemetry = async () => {
      const data = await getTelemetryData();
      setTelemetry(data);
      setLoading(false);
    };
    fetchTelemetry();
  }, []);

  if (loading) {
    return <div className="flex justify-center mt-12"><Spinner size="lg" /></div>;
  }

  // Aggregate failures by concept Name
  const aggregated: Record<string, number> = {};
  telemetry.forEach(t => {
    aggregated[t.conceptName] = (aggregated[t.conceptName] || 0) + 1;
  });

  const sortedConcepts = Object.entries(aggregated).sort((a, b) => b[1] - a[1]);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
      <div>
        <h2 className="text-3xl font-bold mb-2 text-slate-800">Telemetry Dashboard</h2>
        <p className="text-gray-500 text-lg">Track real-time conceptual bottlenecks across the student base.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm border border-slate-200">
          <CardHeader className="bg-slate-50 font-semibold border-b border-slate-100">
            Total AI Interventions Triggered
          </CardHeader>
          <CardBody className="flex justify-center items-center py-8">
            <span className="text-5xl font-bold text-blue-600">{telemetry.length}</span>
          </CardBody>
        </Card>

        <Card className="bg-white shadow-sm border border-slate-200">
          <CardHeader className="bg-slate-50 font-semibold border-b border-slate-100">
            Most Remedial Concept
          </CardHeader>
          <CardBody className="flex justify-center items-center py-8 text-center">
            {sortedConcepts.length > 0 ? (
              <div>
                <span className="text-3xl font-bold text-red-500">{sortedConcepts[0][0]}</span>
                <p className="text-gray-500 mt-2">{sortedConcepts[0][1]} failures</p>
              </div>
            ) : (
              <span className="text-xl text-gray-400">No data yet</span>
            )}
          </CardBody>
        </Card>
      </div>

      <Card className="mt-4 shadow-sm border border-slate-200">
        <CardHeader className="bg-slate-50 font-semibold border-b border-slate-100 text-lg">
          Bottleneck Leaderboard
        </CardHeader>
        <CardBody className="p-0">
          <Table aria-label="Telemetry concept failures table" removeWrapper>
            <TableHeader>
              <TableColumn>CONCEPT</TableColumn>
              <TableColumn>FAILURES</TableColumn>
            </TableHeader>
            <TableBody emptyContent={"No telemetry data available yet."}>
              {sortedConcepts.map(([concept, count]) => (
                <TableRow key={concept}>
                  <TableCell className="font-medium text-slate-700">{concept}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{count}</span>
                      <Progress 
                        value={(count / (sortedConcepts[0]?.[1] || 1)) * 100} 
                        color={count > 5 ? "danger" : "warning"} 
                        className="max-w-md h-2 ml-4"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
