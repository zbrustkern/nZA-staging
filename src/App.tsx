import { useEffect, useState } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Card, CardBody } from "@nextui-org/react";
import { User } from 'firebase/auth';
import { auth, signInWithGoogle, logout } from './services/firebase';
import { Database, LogOut } from 'lucide-react';
import Level1 from './components/Sandbox/Level1';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'level1'>('dashboard');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="max-w-md w-full p-6 shadow-2xl">
          <CardBody className="flex flex-col items-center gap-6">
            <div className="bg-blue-100 p-4 rounded-full text-blue-600">
              <Database size={48} />
            </div>
            <h1 className="text-3xl font-bold text-center">DataEng Academy</h1>
            <p className="text-center text-gray-500">Master dimensional modeling with AI-driven interactive lessons.</p>
            <Button color="primary" size="lg" className="w-full font-bold text-lg mt-4 shadow-md" onClick={signInWithGoogle}>
              Sign In with Google
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar isBordered className="bg-white/70 backdrop-blur-md">
        <NavbarBrand className="cursor-pointer" onClick={() => setCurrentView('dashboard')}>
          <Database className="text-blue-600 mr-2" />
          <p className="font-bold text-inherit text-xl">DataEng Academy</p>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.displayName}</span>
            <Button isIconOnly color="danger" variant="light" onClick={logout} aria-label="Log out">
              <LogOut size={20} />
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <main className="flex-grow p-6">
        {currentView === 'dashboard' ? (
          <div className="max-w-4xl mx-auto flex flex-col gap-6 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl font-bold mb-2">Your Skill Tree</h2>
              <p className="text-gray-500 text-lg">Select a module to continue your training.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card isPressable className="bg-white border-2 border-blue-100 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all duration-300" onClick={() => setCurrentView('level1')}>
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">Level 1: The Atomic Core</h3>
                  <p className="text-gray-600">Learn to distinguish between Facts and Dimensions through an interactive drag-and-drop sandbox.</p>
                </CardBody>
              </Card>
              <Card className="bg-gray-50 border border-gray-200 opacity-60">
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold text-gray-500 mb-2">Level 2: Star Schema Basics</h3>
                  <p className="text-gray-400">Locked. Complete Level 1 to unlock.</p>
                </CardBody>
              </Card>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-300">
            <div className="max-w-4xl mx-auto mb-4">
              <Button variant="light" onClick={() => setCurrentView('dashboard')}>← Back to Dashboard</Button>
            </div>
            <Level1 />
          </div>
        )}
      </main>
    </div>
  );
}
