import React, { useMemo } from 'react';
import { useCareerContext } from '../context/CareerContext';
import { BarChart } from 'lucide-react';

interface SkillGapAnalysisProps {
  selectedJobId: string | null;
  onSelectJob: (jobId: string) => void;
}

export const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({ 
  selectedJobId,
  onSelectJob
}) => {
  const { jobRecommendations, skillGaps, userProfile } = useCareerContext();
  
  const selectedJob = useMemo(() => {
    return jobRecommendations.find(job => job.id === selectedJobId) || jobRecommendations[0];
  }, [jobRecommendations, selectedJobId]);
  
  const selectedSkillGap = useMemo(() => {
    return skillGaps.find(gap => gap.jobId === (selectedJob?.id ?? '')) || skillGaps[0];
  }, [skillGaps, selectedJob]);

  if (!userProfile || !selectedJob || !selectedSkillGap) return null;

  const userSkills = new Set([
    ...userProfile.technicalSkills,
    ...userProfile.softSkills
  ]);

  const matchedSkills = selectedJob.requiredSkills.filter(skill => userSkills.has(skill));
  const skillGapPercentage = (matchedSkills.length / selectedJob.requiredSkills.length) * 100;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Skill Gap Analysis</h3>
      
      <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
        {jobRecommendations.map(job => (
          <button
            key={job.id}
            onClick={() => onSelectJob(job.id)}
            className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium ${
              selectedJob.id === job.id
                ? 'bg-blue-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {job.title} at {job.company}
          </button>
        ))}
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-teal-800 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-xl font-bold">{selectedJob.title}</h4>
              <p className="text-blue-100">{selectedJob.company} • {selectedJob.location}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold">
              {skillGapPercentage.toFixed(0)}% Match
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h5 className="text-lg font-semibold text-gray-800">Skills Overview</h5>
              <BarChart className="h-5 w-5 text-gray-400" />
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Required Skills</span>
                    <span>{selectedJob.requiredSkills.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-800 h-2 rounded-full w-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Your Matching Skills</span>
                    <span>{matchedSkills.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${skillGapPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Skills to Develop</span>
                    <span>{selectedJob.requiredSkills.length - matchedSkills.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full" 
                      style={{ width: `${100 - skillGapPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-lg font-semibold text-gray-800 mb-4">Skills You Have</h5>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map(skill => (
                  <span 
                    key={skill} 
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="text-lg font-semibold text-gray-800 mb-4">Skills to Develop</h5>
              <div className="flex flex-wrap gap-2">
                {selectedJob.requiredSkills
                  .filter(skill => !userSkills.has(skill))
                  .map(skill => (
                    <span 
                      key={skill} 
                      className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h5 className="text-lg font-semibold text-gray-800 mb-4">Skill Gap Details</h5>
            <div className="space-y-4">
              {selectedSkillGap.missingSkills.map(missingSkill => (
                <div key={missingSkill.skill} className="bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800">{missingSkill.skill}</span>
                    <span className={`text-sm px-2 py-0.5 rounded-full ${
                      missingSkill.category === 'technical' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {missingSkill.category === 'technical' ? 'Technical' : 'Soft Skill'}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-800 h-2.5 rounded-full" 
                      style={{ width: `${missingSkill.importance * 10}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Importance Level</span>
                    <span>{missingSkill.importance}/10</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};