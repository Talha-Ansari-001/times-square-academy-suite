import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle,
  XCircle,
  Bell
} from 'lucide-react';
import { blink } from '../lib/blink';
import { User, Class, Announcement, Fee } from '../types';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Spinner from '../components/ui/spinner';
import { Badge } from '../components/ui/badge';
import { useLocation } from 'react-router-dom';

const AdminDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ students: 0, teachers: 0, classes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path === 'admin' || !path) setActiveTab('overview');
    else setActiveTab(path);
  }, [location]);

  const fetchStats = async () => {
    try {
      const studentsCount = await blink.db.userProfiles.count({ where: { role: 'student' } });
      const teachersCount = await blink.db.userProfiles.count({ where: { role: 'teacher' } });
      const classesCount = await blink.db.classes.count();
      
      setStats({
        students: studentsCount,
        teachers: teachersCount,
        classes: classesCount
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full"><Spinner className="w-8 h-8 text-primary" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-primary">Institutional Oversight</h2>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Administrator Panel</p>
        </div>
        <div className="flex bg-muted p-1 rounded-lg">
          {['overview', 'teachers', 'students', 'classes', 'announcements'].map((tab) => (
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

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard icon={<GraduationCap />} label="Enrolled Students" value={stats.students} color="bg-blue-500/10 text-blue-600" />
            <StatsCard icon={<Users />} label="Academic Staff" value={stats.teachers} color="bg-emerald-500/10 text-emerald-600" />
            <StatsCard icon={<BookOpen />} label="Active Classes" value={stats.classes} color="bg-amber-500/10 text-amber-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card-premium h-[400px] flex flex-col">
              <h3 className="text-xl mb-6 font-serif">Recent Announcements</h3>
              <AnnouncementsList limit={5} />
            </div>
            <div className="card-premium h-[400px] flex flex-col">
              <h3 className="text-xl mb-6 font-serif">Recent Fee Activity</h3>
              <FeesList limit={5} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'teachers' && <StaffManager role="teacher" />}
      {activeTab === 'students' && <StaffManager role="student" />}
      {activeTab === 'classes' && <ClassManager />}
      {activeTab === 'announcements' && <AnnouncementManager />}
    </div>
  );
};

const StatsCard = ({ icon, label, value, color }: any) => (
  <div className="card-premium flex items-center gap-4">
    <div className={`p-4 rounded-xl ${color}`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
      <h4 className="text-3xl font-serif text-primary">{value}</h4>
    </div>
  </div>
);

const AnnouncementsList = ({ limit }: { limit?: number }) => {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await blink.db.announcements.list({ limit: limit || 10, orderBy: { date: 'desc' } });
      setItems(data as any);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner className="w-6 h-6 mx-auto mt-10" />;

  return (
    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
      {items.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10 italic">No bulletins posted yet.</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-sm text-primary">{item.title}</h4>
              <span className="text-[10px] text-muted-foreground uppercase">{new Date(item.date).toLocaleDateString()}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{item.text}</p>
          </div>
        ))
      )}
    </div>
  );
};

const FeesList = ({ limit }: { limit?: number }) => {
  const [items, setItems] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await blink.db.fees.list({ limit: limit || 10, orderBy: { date: 'desc' } });
      setItems(data as any);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner className="w-6 h-6 mx-auto mt-10" />;

  return (
    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
      {items.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10 italic">No transactions recorded.</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${item.status === 'paid' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                {item.status === 'paid' ? <CheckCircle size={16} /> : <XCircle size={16} />}
              </div>
              <div>
                <p className="text-xs font-bold text-primary">Student ID: {item.studentId.slice(-6)}</p>
                <p className="text-[10px] text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-primary">${item.amount}</p>
              <p className={`text-[10px] uppercase font-bold ${item.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>{item.status}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const StaffManager = ({ role }: { role: 'teacher' | 'student' }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await blink.db.userProfiles.list({ where: { role } });
      setUsers(data as any);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Input 
            placeholder={`Search ${role}s...`} 
            className="pl-10" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        </div>
      </div>

      <div className="card-premium p-0 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-[10px] uppercase font-bold tracking-widest text-primary/60 border-b border-border">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center"><Spinner className="w-6 h-6 mx-auto" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center italic text-muted-foreground">No records found.</td></tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-primary">{u.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                  <td className="px-6 py-4 font-mono text-xs">{u.id.slice(-8)}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="p-2 hover:bg-blue-500/10 hover:text-blue-600 rounded-lg transition-colors"><Edit2 size={16} /></button>
                    <button className="p-2 hover:bg-accent/10 hover:text-accent rounded-lg transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ClassManager = () => {
  const [items, setItems] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [teacherId, setTeacherId] = useState('');

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const data = await blink.db.classes.list();
      setItems(data as any);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await blink.db.classes.create({ name, teacherId });
      toast.success('Class created');
      setName(''); setTeacherId(''); setShowAdd(false);
      fetchItems();
    } catch (error) { toast.error('Failed to create class'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-serif">Class Distribution</h3>
        <Button onClick={() => setShowAdd(true)} className="flex items-center gap-2"><Plus size={18} /> New Class</Button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="card-premium grid grid-cols-1 md:grid-cols-3 gap-4 items-end animate-fade-in">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Class Name</label>
            <Input placeholder="Calculus AB" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Teacher ID (Service Code)</label>
            <Input placeholder="t_abc..." value={teacherId} onChange={(e) => setTeacherId(e.target.value)} required />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">Create</Button>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <Spinner className="w-8 h-8 mx-auto col-span-full" /> : items.map((c) => (
          <div key={c.id} className="card-premium group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-secondary/10 rounded-xl group-hover:bg-secondary group-hover:text-primary transition-colors">
                <BookOpen size={24} />
              </div>
              <button className="p-2 text-muted-foreground hover:text-accent transition-colors"><Trash2 size={16} /></button>
            </div>
            <h4 className="text-xl font-serif mb-2">{c.name}</h4>
            <p className="text-xs text-muted-foreground mb-4 font-mono">Assigned: {c.teacherId.slice(-8)}</p>
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-secondary">
              <Users size={12} /> View roster
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnnouncementManager = () => {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const data = await blink.db.announcements.list({ orderBy: { date: 'desc' } });
      setItems(data as any);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await blink.db.announcements.delete(id);
      toast.success('Announcement removed');
      fetchItems();
    } catch (error) { toast.error('Failed to delete'); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await blink.db.announcements.create({ 
        title, 
        text, 
        date: new Date().toISOString() 
      });
      toast.success('Announcement published');
      setTitle(''); setText(''); setShowAdd(false);
      fetchItems();
    } catch (error) { toast.error('Failed to publish'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-serif">Bulletins & Alerts</h3>
        <Button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-secondary text-primary hover:bg-secondary/90"><Plus size={18} /> New Post</Button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="card-premium space-y-4 animate-fade-in">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Bulletin Title</label>
            <Input placeholder="Important update regarding..." value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Message Body</label>
            <Input placeholder="Enter details here..." value={text} onChange={(e) => setText(e.target.value)} required />
          </div>
          <div className="flex gap-2">
            <Button type="submit">Publish Bulletin</Button>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {loading ? <Spinner className="w-8 h-8 mx-auto" /> : items.map((item) => (
          <div key={item.id} className="card-premium p-6 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex gap-4">
              <div className="p-3 bg-secondary/10 rounded-xl h-fit">
                <Bell className="text-secondary" />
              </div>
              <div>
                <h4 className="text-lg font-serif mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground max-w-2xl">{item.text}</p>
                <p className="text-[10px] text-primary/40 mt-2 font-bold uppercase tracking-widest">{new Date(item.date).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-start">
              <button 
                onClick={() => handleDelete(item.id)}
                className="p-2 text-muted-foreground hover:text-accent transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
