import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  ChevronRight,
  Bell,
  Clock,
  BookOpen
} from 'lucide-react';
import { blink } from '../lib/blink';
import { useAuth } from '../hooks/useAuth';
import { Class, User, Attendance, Announcement } from '../types';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import Spinner from '../components/ui/spinner';
import { useLocation } from 'react-router-dom';

const TeacherDashboard = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('classes');
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path === 'teacher' || !path) setActiveTab('classes');
    else setActiveTab(path);
  }, [location]);

  useEffect(() => {
    if (user) fetchClasses();
  }, [user]);

  const fetchClasses = async () => {
    try {
      const data = await blink.db.classes.list({ where: { teacherId: user?.id } });
      setClasses(data as any);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Spinner className="w-8 h-8 text-primary" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-primary">Academic Instruction</h2>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Teacher Workspace</p>
        </div>
        <div className="flex bg-muted p-1 rounded-lg">
          {['classes', 'attendance', 'announcements'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-[10px] uppercase font-bold tracking-widest rounded-md transition-all ${
                activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-primary/40 hover:text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground py-12 italic">No classes assigned to your schedule.</p>
          ) : classes.map((c) => (
            <div key={c.id} className="card-premium group cursor-pointer hover:border-secondary" onClick={() => setActiveTab('attendance')}>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-secondary/10 rounded-xl group-hover:bg-secondary group-hover:text-primary transition-colors">
                  <BookOpen size={24} />
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Class ID</span>
                  <p className="text-xs font-mono">{c.id.slice(-6)}</p>
                </div>
              </div>
              <h4 className="text-xl font-serif mb-2">{c.name}</h4>
              <p className="text-xs text-muted-foreground mb-6">Instructional Period: Fall 2026</p>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-secondary">
                  <Calendar size={12} /> Mark attendance
                </div>
                <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'attendance' && <AttendanceTracker classes={classes} />}
      {activeTab === 'announcements' && <BulletinView />}
    </div>
  );
};

const AttendanceTracker = ({ classes }: { classes: Class[] }) => {
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.id || '');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent'>>({});

  useEffect(() => {
    if (selectedClass) fetchStudents();
  }, [selectedClass]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await blink.db.userProfiles.list({ where: { role: 'student' } });
      setStudents(data as any);
      
      const initial: any = {};
      (data as any).forEach((s: any) => initial[s.id] = 'present');
      setAttendance(initial);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const records = Object.entries(attendance).map(([studentId, status]) => ({
      studentId,
      status,
      classId: selectedClass,
      date: new Date().toISOString()
    }));

    try {
      await blink.db.attendance.createMany(records);
      toast.success('Attendance records submitted successfully');
    } catch (error) {
      toast.error('Failed to submit attendance');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <select 
          className="bg-white border border-border rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-secondary"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-2">
          <Clock size={12} /> {new Date().toLocaleDateString()}
        </span>
      </div>

      <div className="card-premium p-0 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-[10px] uppercase font-bold tracking-widest text-primary/60 border-b border-border">
            <tr>
              <th className="px-6 py-4">Student Name</th>
              <th className="px-6 py-4">Student ID</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={3} className="p-8 text-center"><Spinner className="w-6 h-6 mx-auto" /></td></tr>
            ) : students.map((s) => (
              <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-6 py-4 font-bold text-primary">{s.name}</td>
                <td className="px-6 py-4 font-mono text-xs">{s.id.slice(-8)}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-4">
                    <button 
                      onClick={() => setAttendance({...attendance, [s.id]: 'present'})}
                      className={`p-2 rounded-lg transition-all ${attendance[s.id] === 'present' ? 'bg-emerald-500 text-white shadow-lg scale-110' : 'bg-muted text-muted-foreground'}`}
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button 
                      onClick={() => setAttendance({...attendance, [s.id]: 'absent'})}
                      className={`p-2 rounded-lg transition-all ${attendance[s.id] === 'absent' ? 'bg-accent text-white shadow-lg scale-110' : 'bg-muted text-muted-foreground'}`}
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="bg-secondary text-primary hover:bg-secondary/90 px-10">Finalize Records</Button>
      </div>
    </div>
  );
};

const BulletinView = () => {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await blink.db.announcements.list({ orderBy: { date: 'desc' } });
      setItems(data as any);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      {loading ? <Spinner className="w-8 h-8 mx-auto" /> : items.map((item) => (
        <div key={item.id} className="card-premium p-6 flex gap-4 border-l-4 border-l-secondary">
          <div className="p-3 bg-secondary/10 rounded-xl h-fit">
            <Bell className="text-secondary" size={20} />
          </div>
          <div>
            <h4 className="text-lg font-serif mb-1">{item.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
            <p className="text-[10px] text-primary/40 mt-3 font-bold uppercase tracking-widest">{new Date(item.date).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeacherDashboard;