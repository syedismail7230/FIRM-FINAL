import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { NotificationCenter } from './NotificationCenter';
import toast from 'react-hot-toast';

interface HeaderProps {
  user: User | null;
  onSignInClick: () => void;
}

export function Header({ user, onSignInClick }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  React.useEffect(() => {
    const checkAdminStatus = async () => {
      if (user?.email) {
        const { data } = await supabase
          .from('admin_users')
          .select('username')
          .eq('username', user.email)
          .maybeSingle();
        
        setIsAdmin(!!data);
      }
    };
    
    checkAdminStatus();
  }, [user?.email]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-indigo-600">
            {isAdmin ? 'Admin Portal' : 'Firm AI'}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {!isAdmin && (
              <>
                <Link to="/features\" className="nav-link">Features</Link>
                <Link to="/pricing" className="nav-link">Pricing</Link>
                <Link to="/resources" className="nav-link">Resources</Link>
                <Link to="/about" className="nav-link">About</Link>
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <NotificationCenter user={user} />
                <Link
                  to="/profile"
                  className="nav-link flex items-center gap-2"
                >
                  <UserIcon className="w-5 h-5" />
                  Profile
                </Link>
                {isAdmin && location.pathname !== '/admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={onSignInClick}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {!isAdmin && (
                <>
                  <Link to="/features\" className="nav-link">Features</Link>
                  <Link to="/pricing" className="nav-link">Pricing</Link>
                  <Link to="/resources" className="nav-link">Resources</Link>
                  <Link to="/about" className="nav-link">About</Link>
                </>
              )}
              
              {user ? (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <NotificationCenter user={user} />
                  </div>
                  <Link
                    to="/profile"
                    className="nav-link flex items-center gap-2"
                  >
                    <UserIcon className="w-5 h-5" />
                    Profile
                  </Link>
                  {isAdmin && location.pathname !== '/admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={onSignInClick}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}