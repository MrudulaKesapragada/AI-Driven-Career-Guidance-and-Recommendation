import React from 'react';
import { JobRecommendation } from '../types';
import { MapPin, DollarSign, ExternalLink, CheckCircle } from 'lucide-react';

interface JobCardProps {
  job: JobRecommendation;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  isSelected = false,
  onSelect
}) => {
  const { 
    title, 
    company, 
    location, 
    salaryRange, 
    matchPercentage,
    description,
    logo,
    applyLink,
    benefits,
    responsibilities
  } = job;

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(applyLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className={`rounded-lg overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-white'
      }`}
      onClick={onSelect}
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-bold text-lg text-gray-900 line-clamp-2">{title}</h4>
            <p className="text-gray-600 font-medium">{company}</p>
          </div>
          <div className="h-12 w-12 flex-shrink-0">
            <img 
              src={logo} 
              alt={`${company} logo`} 
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <MapPin size={16} className="mr-1" />
              {location}
            </div>
            <div className="flex items-center text-gray-800 font-medium">
              <DollarSign size={16} className="mr-1" />
              {salaryRange}
            </div>
          </div>
          
          <div className="relative pt-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-blue-800">Match Score</span>
              <span className="text-xs font-semibold text-blue-800">{matchPercentage}%</span>
            </div>
            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
              <div 
                style={{ width: `${matchPercentage}%` }} 
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                  matchPercentage > 80 ? 'bg-green-500' : 
                  matchPercentage > 60 ? 'bg-blue-500' : 
                  matchPercentage > 40 ? 'bg-amber-500' : 'bg-red-500'
                }`}
              ></div>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm">{description}</p>
          
          {isSelected && (
            <>
              <div className="border-t border-gray-100 pt-4">
                <h5 className="font-medium text-gray-800 mb-2">Key Responsibilities</h5>
                <ul className="space-y-1">
                  {responsibilities?.map((resp, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <CheckCircle size={16} className="mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h5 className="font-medium text-gray-800 mb-2">Benefits</h5>
                <div className="flex flex-wrap gap-2">
                  {benefits?.map((benefit, idx) => (
                    <span 
                      key={idx}
                      className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button 
            onClick={handleApply}
            className="w-full py-2 bg-blue-800 hover:bg-blue-900 text-white text-sm font-medium rounded-md transition-colors duration-200 flex items-center justify-center"
          >
            Apply Now <ExternalLink size={14} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};