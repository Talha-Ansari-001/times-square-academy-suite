import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, ChevronRight, ArrowLeft } from 'lucide-react';
import { blink } from '../lib/blink';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Spinner from '../components/ui/spinner';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState(searchParams.get('role') || 'student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await blink.auth.signInWithEmail(email, password);
        toast.success('Successfully logged in');
      } else {
        await blink.auth.signUp({
          email,
          password,
          displayName: name,
          metadata: { role }
        });
        toast.success('Account created successfully');
      }
      
      // Redirect based on role
      const targetRole = isLogin ? (await blink.auth.me())?.metadata?.role : role;
      navigate(`/${targetRole}`);
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-6">
      <div className="absolute top-8 left-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-primary/60 hover:text-primary transition-colors font-medium">
          <ArrowLeft size={20} /> Back to home
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="bg-primary p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <GraduationCap className="text-secondary w-10 h-10" />
          </div>
          <h1 className="text-3xl font-serif text-primary mb-2">
            {isLogin ? 'Academy Login' : 'Student Enrollment'}
          </h1>
          <p className="text-muted-foreground">Times Square Academy Suite</p>
        </div>

        <div className="card-premium p-8 lg:p-10 shadow-2xl">
          {!isLogin && (
            <div className="flex bg-muted p-1 rounded-lg mb-8">
              {['student', 'teacher', 'admin'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${
                    role === r ? 'bg-primary text-white shadow-md' : 'text-primary/40'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-primary/60">Full Name</label>
                <div className="relative">
                  <Input 
                    type="text" 
                    placeholder="John Doe" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30">
                    <GraduationCap size={18} />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-primary/60">Institutional Email</label>
              <div className="relative">
                <Input 
                  type="email" 
                  placeholder="name@academy.edu" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30">
                  <Mail size={18} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-primary/60">Passphrase</label>
                {isLogin && <button type="button" className="text-[10px] uppercase font-bold text-secondary hover:underline">Forgot?</button>}
              </div>
              <div className="relative">
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/30">
                  <Lock size={18} />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-sm uppercase font-bold tracking-[0.2em] bg-primary hover:bg-primary/90 text-white shadow-lg flex items-center justify-center gap-2 group"
              disabled={loading}
            >
              {loading ? <Spinner className="w-5 h-5" /> : (
                <>
                  {isLogin ? 'Enter Suite' : 'Enroll Now'}
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="ml-2 text-secondary font-bold hover:underline"
              >
                {isLogin ? 'Enroll Student' : 'Login'}
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          <img src="https://upload.wikimedia.org/wikipedia/commons/d/d4/Academic_Seal_of_Columbia_University.svg" className="h-10" alt="Seal" />
          <img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Harvard_University_logo.svg/1200px-Harvard_University_logo.svg.png" className="h-10" alt="Seal" />
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
