import React, { useState, useMemo } from 'react';
import { useCareerContext } from '../context/CareerContext';
import { Certification } from '../types';
import { Filter, ExternalLink } from 'lucide-react';

export const CertificationList: React.FC = () => {
  const { certifications, skillGaps, selectedJobId } = useCareerContext();
  const [filterOption, setFilterOption] = useState<'all' | 'free' | 'paid'>('all');
  const [sortOption, setSortOption] = useState<'relevance' | 'cost' | 'duration'>('relevance');
  const [showFilters, setShowFilters] = useState(false);

  // Get all missing skills from skill gaps
  const missingSkills = useMemo(() => {
    const skills = new Set<string>();
    skillGaps.forEach(gap => {
      gap.missingSkills.forEach(skill => {
        skills.add(skill.skill);
      });
    });
    return Array.from(skills);
  }, [skillGaps]);

  // Calculate relevance score for each certification based on how many missing skills it covers
  const certificationWithScores = useMemo(() => {
    return certifications.map(cert => {
      const relevanceScore = cert.skillsCovered.filter(skill => 
        missingSkills.includes(skill)
      ).length;
      
      return {
        ...cert,
        relevanceScore
      };
    });
  }, [certifications, missingSkills]);

  // Filter and sort certifications
  const filteredCertifications = useMemo(() => {
    let filtered = [...certificationWithScores];
    
    // Apply cost filter
    if (filterOption === 'free') {
      filtered = filtered.filter(cert => cert.cost === 'Free' || cert.cost === '₹0');
    } else if (filterOption === 'paid') {
      filtered = filtered.filter(cert => cert.cost !== 'Free' && cert.cost !== '₹0');
    }
    
    // Apply sorting
    if (sortOption === 'relevance') {
      filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } else if (sortOption === 'cost') {
      filtered.sort((a, b) => {
        const costA = a.cost === 'Free' || a.cost === '₹0' ? 0 : parseInt(a.cost.replace(/[^\d]/g, ''), 10);
        const costB = b.cost === 'Free' || b.cost === '₹0' ? 0 : parseInt(b.cost.replace(/[^\d]/g, ''), 10);
        return costA - costB;
      });
    } else if (sortOption === 'duration') {
      filtered.sort((a, b) => {
        const getDurationInWeeks = (duration: string) => {
          if (duration.includes('hour')) {
            return parseInt(duration.replace(/[^\d]/g, ''), 10) / 40; // convert hours to weeks
          } else if (duration.includes('day')) {
            return parseInt(duration.replace(/[^\d]/g, ''), 10) / 7; // convert days to weeks
          } else if (duration.includes('month')) {
            return parseInt(duration.replace(/[^\d]/g, ''), 10) * 4; // convert months to weeks
          } else {
            return parseInt(duration.replace(/[^\d]/g, ''), 10); // already in weeks
          }
        };
        
        return getDurationInWeeks(a.duration) - getDurationInWeeks(b.duration);
      });
    }
    
    return filtered;
  }, [certificationWithScores, filterOption, sortOption]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-xl font-semibold text-gray-800">Recommended Certifications</h3>
        
        <div className="flex items-center">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-gray-700 hover:text-blue-800 transition-colors"
          >
            <Filter size={18} className="mr-1" />
            <span>Filter & Sort</span>
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Filter by Cost</h4>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setFilterOption('all')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterOption === 'all' 
                      ? 'bg-blue-800 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilterOption('free')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterOption === 'free' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Free
                </button>
                <button 
                  onClick={() => setFilterOption('paid')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterOption === 'paid' 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Paid
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Sort by</h4>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setSortOption('relevance')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    sortOption === 'relevance' 
                      ? 'bg-blue-800 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Relevance
                </button>
                <button 
                  onClick={() => setSortOption('cost')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    sortOption === 'cost' 
                      ? 'bg-blue-800 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Cost (Low to High)
                </button>
                <button 
                  onClick={() => setSortOption('duration')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    sortOption === 'duration' 
                      ? 'bg-blue-800 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Duration (Short to Long)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {filteredCertifications.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-6 text-center">
          <p className="text-amber-800">
            No certification recommendations available. Try updating your profile with more details.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertifications.map(cert => (
            <CertificationCard 
              key={cert.id} 
              certification={cert} 
              relevanceScore={cert.relevanceScore}
              missingSkills={missingSkills}
            />
          ))}
        </div>
      )}
      
      <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mt-8">
        <h4 className="text-blue-800 font-medium">Why These Certifications?</h4>
        <p className="text-blue-700 text-sm mt-1">
          These certifications are recommended based on the skill gaps identified in your profile.
          Completing these courses will help you gain the skills needed for your target jobs and improve your employability.
        </p>
      </div>
    </div>
  );
};

interface CertificationCardProps {
  certification: Certification & { relevanceScore: number };
  relevanceScore: number;
  missingSkills: string[];
}

const CertificationCard: React.FC<CertificationCardProps> = ({ 
  certification, 
  relevanceScore,
  missingSkills
}) => {
  const { 
    name, 
    provider, 
    cost, 
    duration, 
    link, 
    skillsCovered,
    logo
  } = certification;
  
  // Calculate relevance percentage
  const maxPossibleRelevance = Math.min(skillsCovered.length, missingSkills.length);
  const relevancePercentage = maxPossibleRelevance > 0 
    ? Math.round((relevanceScore / maxPossibleRelevance) * 100) 
    : 0;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h4 className="font-bold text-lg text-gray-900">{name}</h4>
            <p className="text-gray-600">{provider}</p>
          </div>
          <div className="h-12 w-12 flex-shrink-0">
            <img 
              src={logo} 
              alt={`${provider} logo`} 
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="flex items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                cost === 'Free' || cost === '₹0' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {cost}
              </span>
            </div>
            <span className="text-gray-600 text-sm">{duration}</span>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Skills Covered:</h5>
            <div className="flex flex-wrap gap-2">
              {skillsCovered.map(skill => {
                const isMissingSkill = missingSkills.includes(skill);
                return (
                  <span 
                    key={skill} 
                    className={`px-2 py-1 rounded-full text-xs ${
                      isMissingSkill 
                        ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>
          
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Relevance to your needs</span>
              <span>{relevancePercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  relevancePercentage > 75 ? 'bg-green-500' : 
                  relevancePercentage > 50 ? 'bg-blue-500' : 
                  relevancePercentage > 25 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${relevancePercentage}%` }}
              ></div>
            </div>
          </div>
          
          <a 
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center w-full py-2 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium rounded-md transition-colors duration-200"
          >
            View Course <ExternalLink size={14} className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};