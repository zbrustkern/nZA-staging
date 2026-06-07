import { useState, useEffect } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Card, CardBody } from "@nextui-org/react";
import { User } from 'firebase/auth';
import { auth, signInWithGoogle, logout } from './services/firebase';
import { Database, LogOut, BarChart3 } from 'lucide-react';
import UnitViewer from './components/Sandbox/UnitViewer';
import TelemetryViewer from './components/Dashboard/TelemetryViewer';
import { DATA_ENG_TRACK } from './config/syllabus';
import { getUserProgress } from './services/db';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'level1' | 'telemetry'>('dashboard');
  const [activeUnitId, setActiveUnitId] = useState<string>(DATA_ENG_TRACK.courses[0].units[0].id);
  const [completedUnitIds, setCompletedUnitIds] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const progress = await getUserProgress();
        if (progress?.completedUnitIds) {
          setCompletedUnitIds(progress.completedUnitIds);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentView]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full shadow-2xl border-none">
          <CardBody className="p-8 flex flex-col items-center gap-6">
            <div className="bg-blue-100 p-4 rounded-full text-blue-600">
              <Database size={48} />
            </div>
            <h1 className="text-3xl font-bold text-center">notZekeAcademy</h1>
            <p className="text-center text-gray-500">Master dimensional modeling with AI-driven interactive lessons.</p>
            <Button color="primary" size="lg" className="w-full font-bold text-lg mt-4 shadow-md" onClick={signInWithGoogle}>
              Sign In with Google
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  const handleStartUnit = (unitId: string) => {
    setActiveUnitId(unitId);
    setCurrentView('level1');
  };

  const handleReturnToDashboard = () => {
    setCurrentView('dashboard');
  };

  let activeUnit = DATA_ENG_TRACK.courses.flatMap(c => c.units).find(u => u.id === activeUnitId);
  if (!activeUnit) activeUnit = DATA_ENG_TRACK.courses[0].units[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar isBordered className="bg-white/70 backdrop-blur-md">
        <NavbarBrand className="cursor-pointer" onClick={() => setCurrentView('dashboard')}>
          <Database className="text-blue-600 mr-2" />
          <p className="font-bold text-inherit text-xl">notZekeAcademy</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem className="flex items-center gap-4">
            <Button variant="light" startContent={<BarChart3 size={18} />} onClick={() => setCurrentView('telemetry')} className="font-medium text-slate-600 hidden sm:flex">
              Telemetry
            </Button>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.displayName}</span>
            <Button isIconOnly color="danger" variant="light" onClick={logout} aria-label="Log out">
              <LogOut size={20} />
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="flex-grow p-6">
        {currentView === 'dashboard' && (
          <div className="max-w-4xl mx-auto flex flex-col gap-10 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl font-bold mb-2">Your Skill Tree: {DATA_ENG_TRACK.title}</h2>
              <p className="text-gray-500 text-lg">{DATA_ENG_TRACK.description}</p>
            </div>
            
            {DATA_ENG_TRACK.courses.map((course) => (
              <div key={course.id} className="flex flex-col gap-4">
                <div className="border-b border-gray-200 pb-2">
                  <h3 className="text-2xl font-semibold text-slate-800">{course.title}</h3>
                  <p className="text-gray-500">{course.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {course.units.map((unit, index) => {
                    const isUnlocked = index === 0 || completedUnitIds.includes(course.units[index - 1].id);
                    const isCompleted = completedUnitIds.includes(unit.id);
                    
                    return (
                      <Card 
                        key={unit.id}
                        isPressable={isUnlocked}
                        className={`border-2 transition-all duration-300 ${isUnlocked ? 'bg-white border-blue-100 shadow-sm hover:shadow-lg hover:border-blue-400' : 'bg-gray-50 border-gray-200 opacity-60'}`} 
                        onClick={() => isUnlocked && handleStartUnit(unit.id)}
                      >
                        <CardBody className="p-6">
                          <h4 className={`text-xl font-bold mb-2 ${isUnlocked ? 'text-blue-900' : 'text-gray-500'}`}>
                            {unit.title}
                            {isCompleted && <span className="ml-2 text-sm text-green-500">✓ Completed</span>}
                          </h4>
                          <p className={isUnlocked ? 'text-gray-600' : 'text-gray-400'}>
                            {isUnlocked ? unit.description : 'Locked. Complete previous unit to unlock.'}
                          </p>
                        </CardBody>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentView === 'level1' && (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="max-w-4xl mx-auto mb-4">
              <Button variant="light" onClick={handleReturnToDashboard}>← Back to Dashboard</Button>
            </div>
            <UnitViewer unitId={activeUnit.id} onReturnToDashboard={handleReturnToDashboard} />
          </div>
        )}

        {currentView === 'telemetry' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-4xl mx-auto mb-4">
              <Button variant="light" onClick={handleReturnToDashboard}>← Back to Dashboard</Button>
            </div>
            <TelemetryViewer />
          </div>
        )}
      </main>
    </div>
  );
}
