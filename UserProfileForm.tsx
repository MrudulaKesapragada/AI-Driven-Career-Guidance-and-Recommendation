import React, { useState } from 'react';
import { useCareerContext } from '../context/CareerContext';
import { UserProfile } from '../types';
import { SkillSelector } from './SkillSelector';

const initialProfile: UserProfile = {
  name: '',
  email: '',
  technicalSkills: [],
  softSkills: [],
  interests: [],
  education: {
    degree: '',
    institution: '',
    graduationYear: new Date().getFullYear(),
    major: ''
  },
  experience: {
    yearsOfExperience: 0,
    currentRole: '',
    currentCompany: ''
  }
};

// Available skill options
const technicalSkillOptions = [
  'JavaScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby',
  'HTML/CSS', 'React', 'Angular', 'Vue.js', 'Node.js', 'Django',
  'Flask', 'Spring Boot', 'SQL', 'MongoDB', 'AWS', 'Azure',
  'GCP', 'Docker', 'Kubernetes', 'Git', 'TensorFlow', 'PyTorch',
  'Data Analysis', 'Machine Learning', 'Deep Learning', 'NLP',
  'Computer Vision', 'Blockchain', 'iOS Development', 'Android Development'
];

const softSkillOptions = [
  'Communication', 'Leadership', 'Teamwork', 'Problem Solving',
  'Critical Thinking', 'Time Management', 'Adaptability',
  'Creativity', 'Emotional Intelligence', 'Conflict Resolution',
  'Negotiation', 'Presentation Skills', 'Decision Making',
  'Project Management', 'Mentoring'
];

const interestOptions = [
  'Web Development', 'Mobile Development', 'Data Science',
  'Machine Learning', 'AI', 'Blockchain', 'Cloud Computing',
  'DevOps', 'Cybersecurity', 'Game Development', 'UI/UX Design',
  'Product Management', 'Digital Marketing', 'IoT',
  'Augmented Reality', 'Virtual Reality', 'Robotics'
];

export const UserProfileForm: React.FC = () => {
  const { updateUserProfile, isLoading } = useCareerContext();
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof UserProfile],
          [field]: field === 'graduationYear' ? parseInt(value) || '' : value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSkillsChange = (skillType: 'technicalSkills' | 'softSkills' | 'interests', skills: string[]) => {
    setProfile(prev => ({
      ...prev,
      [skillType]: skills
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(profile);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return profile.name.trim() !== '' && 
               profile.email.trim() !== '' &&
               profile.education.degree.trim() !== '' &&
               profile.education.institution.trim() !== '' &&
               profile.education.major.trim() !== '' &&
               profile.education.graduationYear > 1900;
      case 2:
        return profile.technicalSkills.length > 0 && 
               profile.softSkills.length > 0 && 
               profile.interests.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-teal-800 p-6 text-white">
          <h2 className="text-2xl font-bold">Build Your Career Profile</h2>
          <p className="mt-2 opacity-90">
            Tell us about yourself so we can find the perfect career matches for you.
          </p>

          <div className="flex mt-6">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div key={idx} className="flex-1">
                <div className="relative flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    currentStep > idx + 1 ? 'bg-teal-400 text-blue-900' : 
                    currentStep === idx + 1 ? 'bg-white text-blue-900' : 
                    'bg-blue-800 text-white'
                  }`}>
                    {currentStep > idx + 1 ? '✓' : idx + 1}
                  </div>
                  <div className={`flex-1 h-1 ${
                    idx < totalSteps - 1 ? (
                      currentStep > idx + 1 ? 'bg-teal-400' : 'bg-blue-800'
                    ) : 'hidden'
                  }`}></div>
                </div>
                <span className="text-xs mt-1 block">
                  {idx === 0 ? 'Basic Info' : idx === 1 ? 'Skills & Interests' : 'Experience'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-800 pt-4">Education</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="education.degree" className="block text-sm font-medium text-gray-700 mb-1">
                    Highest Degree
                  </label>
                  <select
                    id="education.degree"
                    name="education.degree"
                    value={profile.education.degree}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Degree</option>
                    <option value="High School">High School</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelor's">Bachelor's</option>
                    <option value="Master's">Master's</option>
                    <option value="Ph.D.">Ph.D.</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="education.institution" className="block text-sm font-medium text-gray-700 mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    id="education.institution"
                    name="education.institution"
                    value={profile.education.institution}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter institution name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="education.graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="number"
                    id="education.graduationYear"
                    name="education.graduationYear"
                    value={profile.education.graduationYear}
                    onChange={handleInputChange}
                    min="1900"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter graduation year"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="education.major" className="block text-sm font-medium text-gray-700 mb-1">
                    Field of Study / Major
                  </label>
                  <input
                    type="text"
                    id="education.major"
                    name="education.major"
                    value={profile.education.major}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Computer Science, Business"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-semibold text-gray-800">Skills & Interests</h3>
              <p className="text-gray-600">
                Select your skills and interests to help us match you with the right opportunities.
              </p>
              
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Technical Skills
                  </label>
                  <SkillSelector
                    options={technicalSkillOptions}
                    selectedSkills={profile.technicalSkills}
                    onChange={(skills) => handleSkillsChange('technicalSkills', skills)}
                    placeholder="Select or type your technical skills"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Select up to 10 technical skills you possess
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soft Skills
                  </label>
                  <SkillSelector
                    options={softSkillOptions}
                    selectedSkills={profile.softSkills}
                    onChange={(skills) => handleSkillsChange('softSkills', skills)}
                    placeholder="Select or type your soft skills"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Select up to 5 soft skills you excel at
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Career Interests
                  </label>
                  <SkillSelector
                    options={interestOptions}
                    selectedSkills={profile.interests}
                    onChange={(skills) => handleSkillsChange('interests', skills)}
                    placeholder="Select or type your career interests"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Select up to 5 areas you're interested in pursuing
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-semibold text-gray-800">Professional Experience</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="experience.yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <select
                    id="experience.yearsOfExperience"
                    name="experience.yearsOfExperience"
                    value={profile.experience.yearsOfExperience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="0">0 (Fresher)</option>
                    <option value="1">1 year</option>
                    <option value="2">2 years</option>
                    <option value="3">3 years</option>
                    <option value="4">4 years</option>
                    <option value="5">5 years</option>
                    <option value="6">6-8 years</option>
                    <option value="9">9-12 years</option>
                    <option value="13">13+ years</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="experience.currentRole" className="block text-sm font-medium text-gray-700 mb-1">
                    Current/Most Recent Job Title
                  </label>
                  <input
                    type="text"
                    id="experience.currentRole"
                    name="experience.currentRole"
                    value={profile.experience.currentRole || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Software Engineer, Data Scientist"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="experience.currentCompany" className="block text-sm font-medium text-gray-700 mb-1">
                    Current/Most Recent Company
                  </label>
                  <input
                    type="text"
                    id="experience.currentCompany"
                    name="experience.currentCompany"
                    value={profile.experience.currentCompany || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. TCS, Infosys, Freelancer"
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="text-blue-800 font-medium">What happens next?</h4>
                <p className="text-blue-700 text-sm mt-1">
                  Our AI will analyze your profile and match you with the best career opportunities in the Indian job market. 
                  You'll receive personalized job recommendations, skill gap analysis, and certification suggestions.
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Back
              </button>
            )}
            <div className="ml-auto">
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isCurrentStepValid()}
                  className={`px-6 py-2 rounded-md ${
                    isCurrentStepValid()
                      ? 'bg-blue-800 text-white hover:bg-blue-900'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } transition-colors duration-200`}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-md ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-700'
                  } text-white transition-colors duration-200 flex items-center`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing Profile...
                    </>
                  ) : (
                    'Get Career Recommendations'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};