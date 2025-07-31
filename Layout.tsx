import React, { ReactNode } from 'react';
import { UserCircle } from 'lucide-react';
import { useCareerContext } from '../context/CareerContext';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { userProfile, hasSubmittedProfile } = useCareerContext();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-blue-900 to-teal-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span className="text-xl font-bold">Career.AI</span>
            </div>
            
            {hasSubmittedProfile && (
              <div className="flex items-center space-x-2 ml-4 p-2 bg-white/10 rounded-full">
                <UserCircle className="h-6 w-6" />
                <span className="text-sm font-medium">{userProfile?.name}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {!hasSubmittedProfile && (
        <div className="bg-gradient-to-b from-blue-900 to-teal-800 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Your AI-Powered Career Navigator
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Let AI guide you to your perfect career path with personalized job matches, skill analysis, and learning recommendations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mt-12">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Smart Job Matching</h3>
                  <p className="text-sm text-blue-100">
                    AI-powered algorithm matches your profile with the perfect job opportunities
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Skill Gap Analysis</h3>
                  <p className="text-sm text-blue-100">
                    Identify and bridge skill gaps with personalized learning paths
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Market Insights</h3>
                  <p className="text-sm text-blue-100">
                    Real-time analytics of job market trends and salary data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-slate-800 text-slate-300 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Career.AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};