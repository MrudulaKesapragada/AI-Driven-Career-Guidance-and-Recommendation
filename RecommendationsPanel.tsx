import React, { useState } from 'react';
import { useCareerContext } from '../context/CareerContext';
import { JobCard } from './JobCard';
import { SkillGapAnalysis } from './SkillGapAnalysis';
import { CertificationList } from './CertificationList';
import { CareerInsightsDashboard } from './CareerInsightsDashboard';
import { ArrowLeft } from 'lucide-react';

export const RecommendationsPanel: React.FC = () => {
  const { 
    userProfile, 
    jobRecommendations, 
    resetProfile
  } = useCareerContext();
  
  const [activeTab, setActiveTab] = useState<'jobs' | 'skills' | 'certifications' | 'insights'>('jobs');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    jobRecommendations.length > 0 ? jobRecommendations[0].id : null
  );

  if (!userProfile) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header section with user name and back button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          Hi {userProfile.name.split(' ')[0]}, here are your personalized career recommendations
        </h2>
        <button 
          onClick={resetProfile}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} className="mr-1" />
          Update Profile
        </button>
      </div>

      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'jobs'
                ? 'border-blue-800 text-blue-800'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Job Recommendations
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'skills'
                ? 'border-blue-800 text-blue-800'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Skill Gap Analysis
          </button>
          <button
            onClick={() => setActiveTab('certifications')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'certifications'
                ? 'border-blue-800 text-blue-800'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Recommended Certifications
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'insights'
                ? 'border-blue-800 text-blue-800'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Career Insights
          </button>
        </nav>
      </div>

      {/* Tab content */}
      <div className="animate-fadeIn">
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800">Top Job Matches</h3>
            
            {jobRecommendations.length === 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
                No job matches found. Try updating your profile with more skills and experience.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobRecommendations.map(job => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    isSelected={selectedJobId === job.id}
                    onSelect={() => setSelectedJobId(job.id)}
                  />
                ))}
              </div>
            )}
            
            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-md p-4">
              <h4 className="text-blue-800 font-medium">Analyzing your profile</h4>
              <p className="text-blue-700 text-sm mt-1">
                Based on your profile, we've identified job roles that match your skills and interests.
                Click on the "Skill Gap Analysis" tab to see what skills you need to develop for each role.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <SkillGapAnalysis selectedJobId={selectedJobId} onSelectJob={setSelectedJobId} />
        )}

        {activeTab === 'certifications' && (
          <CertificationList />
        )}

        {activeTab === 'insights' && (
          <CareerInsightsDashboard />
        )}
      </div>
    </div>
  );
};