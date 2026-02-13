import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircle, 
  Calendar, 
  CreditCard, 
  Bell, 
  CheckCircle, 
  XCircle,
  Clock,
  BookOpen,
  MapPin,
  Mail
} from 'lucide-react';
import { blink } from '../lib/blink';
import { useAuth } from '../hooks/useAuth';
import { Attendance, Fee, Announcement } from '../types';
import Spinner from '../components/ui/spinner';
import { Badge } from '../components/ui/badge';
import { useLocation } from 'react-router-dom';

const StudentDashboard = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path === 'student' || !path) setActiveTab('overview');
    else setActiveTab(path);
  }, [location]);

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif text-primary">Academic Record</h2>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Student Workspace</p>
        </div>
        <div className="flex bg-muted p-1 rounded-lg">
          {['overview', 'attendance', 'fees', 'announcements'].map((tab) => (
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card-premium text-center">
              <div className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg overflow-hidden">
                <UserCircle size={64} className="text-primary" />
              </div>
              <h3 className="text-2xl font-serif mb-1">{user.name}</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-6">Class: Senior Advanced</p>
              
              <div className="space-y-4 text-left pt-6 border-t border-border">
                <ProfileItem icon={<Mail size={16} />} label="Email" value={user.email} />
                <ProfileItem icon={<MapPin size={16} />} label="Campus" value="Times Square Main" />
                <ProfileItem icon={<Clock size={16} />} label="Session" value="Fall 2026" />
              </div>
            </div>

            <div className="card-premium">
              <h4 className="text-lg font-serif mb-4">Current Term Schedule</h4>
              <div className="space-y-3">
                <ScheduleItem time="09:00 AM" subject="Calculus AB" room="Room 402" />
                <ScheduleItem time="11:30 AM" subject="Modern Literature" room="Library Wing" />
                <ScheduleItem time="02:00 PM" subject="World History" room="Hall A" />
              </div>
            </div>
          </div>

          {/* Activity/Announcements */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SummaryCard 
                title="Overall Attendance" 
                value="94%" 
                icon={<Calendar className="text-blue-600" />} 
                footer="Top 5% of class"
              />
              <SummaryCard 
                title="Account Status" 
                value="Up-to-date" 
                icon={<CreditCard className="text-emerald-600" />} 
                footer="Next payment: Oct 1st"
              />
            </div>

            <div className="card-premium h-[450px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-serif">Academy Bulletins</h3>
                <Badge variant="outline" className="text-secondary border-secondary uppercase text-[10px]">New Updates</Badge>
              </div>
              <BulletinList limit={4} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && <StudentAttendance studentId={user.id} />}
      {activeTab === 'fees' && <StudentFees studentId={user.id} />}
      {activeTab === 'announcements' && <BulletinList />}
    </div>
  );
};

const ProfileItem = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-3">
    <div className="text-secondary">{icon}</div>
    <div>
      <p className="text-[10px] uppercase font-bold text-muted-foreground leading-tight">{label}</p>
      <p className="text-sm font-medium text-primary">{value}</p>
    </div>
  </div>
);

const ScheduleItem = ({ time, subject, room }: any) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
    <div className="flex items-center gap-3">
      <div className="text-[10px] font-bold text-secondary uppercase whitespace-nowrap">{time}</div>
      <div className="w-px h-4 bg-border" />
      <div className="text-sm font-bold text-primary">{subject}</div>
    </div>
    <div className="text-[10px] font-medium text-muted-foreground">{room}</div>
  </div>
);

const SummaryCard = ({ title, value, icon, footer }: any) => (
  <div className="card-premium relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-20">
      {React.cloneElement(icon as React.ReactElement, { size: 48 })}
    </div>
    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">{title}</p>
    <h4 className="text-4xl font-serif text-primary mb-2">{value}</h4>
    <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">{footer}</p>
  </div>
);

const BulletinList = ({ limit }: { limit?: number }) => {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await blink.db.announcements.list({ limit: limit || 10, orderBy: { date: 'desc' } });
      setItems(data as any);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  if (loading) return <Spinner className="w-8 h-8 mx-auto mt-10" />;

  return (
    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
      {items.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10 italic">No academy bulletins at this time.</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="p-5 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-primary">{item.title}</h4>
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{new Date(item.date).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{item.text}</p>
          </div>
        ))
      )}
    </div>
  );
};

const StudentAttendance = ({ studentId }: { studentId: string }) => {
  const [items, setItems] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, [studentId]);

  const fetchItems = async () => {
    try {
      const data = await blink.db.attendance.list({ 
        where: { studentId },
        orderBy: { date: 'desc' }
      });
      setItems(data as any);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="card-premium p-0 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-[10px] uppercase font-bold tracking-widest text-primary/60 border-b border-border">
            <tr>
              <th className="px-6 py-4">Session Date</th>
              <th className="px-6 py-4">Instructional Module</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={3} className="p-8 text-center"><Spinner className="w-6 h-6 mx-auto" /></td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={3} className="p-8 text-center italic text-muted-foreground">No attendance records found.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-primary">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-muted-foreground uppercase text-xs font-bold tracking-wider">Advanced Science (Lab)</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <Badge className={item.status === 'present' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-accent hover:bg-accent/90'}>
                        {item.status.toUpperCase()}
                      </Badge>
                    </div>
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

const StudentFees = ({ studentId }: { studentId: string }) => {
  const [items, setItems] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, [studentId]);

  const fetchItems = async () => {
    try {
      const data = await blink.db.fees.list({ 
        where: { studentId },
        orderBy: { date: 'desc' }
      });
      setItems(data as any);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="card-premium p-0 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted text-[10px] uppercase font-bold tracking-widest text-primary/60 border-b border-border">
            <tr>
              <th className="px-6 py-4">Transaction Date</th>
              <th className="px-6 py-4">Itemized Service</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4 text-center">Payment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center"><Spinner className="w-6 h-6 mx-auto" /></td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center italic text-muted-foreground">No financial records found.</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-primary">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-muted-foreground text-xs font-bold uppercase">Quarterly Tuition Fee</td>
                  <td className="px-6 py-4 font-bold">${item.amount}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <Badge variant={item.status === 'paid' ? 'default' : 'destructive'} className={item.status === 'paid' ? 'bg-emerald-500' : ''}>
                        {item.status.toUpperCase()}
                      </Badge>
                    </div>
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

export default StudentDashboard;