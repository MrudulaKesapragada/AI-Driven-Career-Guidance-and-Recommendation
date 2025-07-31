import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface SkillSelectorProps {
  options: string[];
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
  placeholder?: string;
  maxSkills?: number;
}

export const SkillSelector: React.FC<SkillSelectorProps> = ({
  options,
  selectedSkills,
  onChange,
  placeholder = 'Select skills',
  maxSkills = 10
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter options based on input value and already selected skills
    const filtered = options.filter(
      option => 
        option.toLowerCase().includes(inputValue.toLowerCase()) && 
        !selectedSkills.includes(option)
    );
    setFilteredOptions(filtered);
  }, [inputValue, options, selectedSkills]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!showDropdown) {
      setShowDropdown(true);
    }
  };

  const handleSelectOption = (option: string) => {
    if (selectedSkills.length < maxSkills) {
      onChange([...selectedSkills, option]);
      setInputValue('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Add custom skill on Enter if it's not in the options and not empty
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      
      // Check if it already exists in selected skills
      if (!selectedSkills.includes(inputValue.trim()) && selectedSkills.length < maxSkills) {
        onChange([...selectedSkills, inputValue.trim()]);
        setInputValue('');
      }
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <div 
        className={`border ${showDropdown ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'} 
                   rounded-md px-3 py-2 flex flex-wrap gap-2 min-h-[42px] cursor-text`}
        onClick={() => document.getElementById('skill-input')?.focus()}
      >
        {selectedSkills.map(skill => (
          <div 
            key={skill} 
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center"
          >
            {skill}
            <button 
              type="button" 
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveSkill(skill);
              }}
              className="ml-1 text-blue-600 hover:text-blue-800"
              aria-label={`Remove ${skill}`}
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <input
          id="skill-input"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={() => setShowDropdown(true)}
          className="flex-grow min-w-[120px] outline-none text-gray-800 bg-transparent"
          placeholder={selectedSkills.length === 0 ? placeholder : ''}
          disabled={selectedSkills.length >= maxSkills}
        />
      </div>
      
      {showDropdown && filteredOptions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.map(option => (
            <div
              key={option}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-700"
              onClick={() => handleSelectOption(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
      
      {selectedSkills.length >= maxSkills && (
        <p className="mt-1 text-xs text-amber-600">
          Maximum of {maxSkills} skills reached
        </p>
      )}
    </div>
  );
};