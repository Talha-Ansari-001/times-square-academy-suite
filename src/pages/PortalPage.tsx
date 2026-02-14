import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ShieldCheck, UserCircle, Users, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const PortalPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col items-center justify-center p-6">
      <div className="absolute top-8 left-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-primary/60 hover:text-primary transition-colors font-medium">
          <ArrowLeft size={20} /> Back to Website
        </button>
      </div>

      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="bg-primary p-4 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <GraduationCap className="text-secondary w-12 h-12" />
          </div>
          <h1 className="text-4xl font-serif text-primary mb-3">Academic Suite Portal</h1>
          <p className="text-muted-foreground text-lg italic">Select your institutional role to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <RoleCard 
            icon={<ShieldCheck className="w-12 h-12 text-secondary" />}
            title="Administrator"
            description="Institutional oversight and management"
            role="admin"
          />
          <RoleCard 
            icon={<Users className="w-12 h-12 text-secondary" />}
            title="Teacher"
            description="Classroom management and student tracking"
            role="teacher"
          />
          <RoleCard 
            icon={<UserCircle className="w-12 h-12 text-secondary" />}
            title="Student"
            description="Academic records and announcements"
            role="student"
          />
        </div>
      </div>

      <footer className="mt-16 text-primary/40 text-sm font-medium">
        Times Square Academy Suite • Version 2.0
      </footer>
    </div>
  );
};

const RoleCard = ({ icon, title, description, role }: any) => (
  <motion.div 
    whileHover={{ y: -8, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center border border-white/50 cursor-pointer group hover:border-secondary/30 transition-all duration-300"
  >
    <div className="mb-6 p-5 bg-primary/5 rounded-2xl group-hover:bg-secondary/10 transition-colors">
      {icon}
    </div>
    <h3 className="text-2xl mb-3 font-serif text-primary">{title}</h3>
    <p className="text-muted-foreground mb-8 text-sm leading-relaxed px-4">
      {description}
    </p>
    <Link 
      to={`/login?role=${role}`} 
      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-primary/5 text-primary font-bold uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all shadow-sm"
    >
      Login as {role} <ChevronRight className="w-4 h-4" />
    </Link>
  </motion.div>
);

export default PortalPage;