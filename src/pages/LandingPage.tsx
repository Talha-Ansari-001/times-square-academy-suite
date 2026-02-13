import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, ShieldCheck, UserCircle, Users, BookOpen, Bell, CreditCard, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-primary/95 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-secondary w-8 h-8" />
          <span className="text-white font-serif text-xl font-bold tracking-tight uppercase">Times Square Academy</span>
        </div>
        <div className="flex items-center gap-6 text-white/80 text-sm font-medium">
          <Link to="/login" className="hover:text-secondary transition-colors">Portals</Link>
          <Link to="/login" className="btn-secondary py-2 px-6">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1623631484725-fef26b75b402?q=80&w=2000&auto=format&fit=crop" 
            alt="Academy Building" 
            className="w-full h-full object-cover scale-105 brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-transparent to-primary/80" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl text-white font-serif mb-6 leading-tight text-glow">
              Excellence in the <br />
              <span className="text-secondary italic">Heart of New York</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10 font-sans font-light">
              Empowering the next generation of leaders through rigorous academic standards and a community built on integrity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
                Access Portals
              </Link>
              <button className="text-white flex items-center gap-2 hover:gap-4 transition-all duration-300">
                Learn more <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portal Selection */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4">Academic Suites</h2>
          <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <PortalCard 
            icon={<ShieldCheck className="w-12 h-12 text-secondary" />}
            title="Admin Portal"
            description="Complete institutional oversight, management, and strategic controls."
            link="/login?role=admin"
          />
          <PortalCard 
            icon={<Users className="w-12 h-12 text-secondary" />}
            title="Teacher Portal"
            description="Manage your classroom, track attendance, and nurture student growth."
            link="/login?role=teacher"
          />
          <PortalCard 
            icon={<UserCircle className="w-12 h-12 text-secondary" />}
            title="Student Portal"
            description="Access your academic records, track progress, and view announcements."
            link="/login?role=student"
          />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-secondary font-medium tracking-widest uppercase mb-4 block">Unified Management</span>
            <h2 className="text-4xl md:text-5xl mb-8 leading-tight">Everything you need for a <span className="text-secondary italic">connected campus.</span></h2>
            
            <div className="space-y-6">
              <FeatureItem icon={<Bell />} title="Instant Announcements" text="Stay informed with real-time updates from the academy administration." />
              <FeatureItem icon={<BookOpen />} title="Attendance Tracking" text="Digitized attendance system for teachers and instant visibility for students." />
              <FeatureItem icon={<CreditCard />} title="Fee Management" text="Transparent tracking of tuition and academic fees for students and parents." />
            </div>
          </div>
          
          <div className="relative">
            <div className="glass p-2 rounded-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1544084963-312608e3955f?q=80&w=1000&auto=format&fit=crop" 
                alt="Modern Interior" 
                className="rounded-xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary border-t border-white/10 py-12 px-6 text-white/60">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-secondary w-6 h-6" />
            <span className="text-white font-serif text-lg font-bold tracking-tight uppercase">Times Square Academy</span>
          </div>
          <p className="text-sm">© 2026 Times Square Academy. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const PortalCard = ({ icon, title, description, link }: any) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="card-premium p-10 flex flex-col items-center text-center"
  >
    <div className="mb-6 p-4 bg-primary/5 rounded-2xl">
      {icon}
    </div>
    <h3 className="text-2xl mb-4 font-serif">{title}</h3>
    <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
      {description}
    </p>
    <Link to={link} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-primary/20 text-primary font-medium hover:bg-primary hover:text-white transition-all group">
      Enter Suite <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </Link>
  </motion.div>
);

const FeatureItem = ({ icon, title, text }: any) => (
  <div className="flex gap-4">
    <div className="p-3 bg-white/10 rounded-xl h-fit">
      {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6 text-secondary' })}
    </div>
    <div>
      <h4 className="text-xl font-serif mb-1">{title}</h4>
      <p className="text-white/60 text-sm">{text}</p>
    </div>
  </div>
);

export default LandingPage;
