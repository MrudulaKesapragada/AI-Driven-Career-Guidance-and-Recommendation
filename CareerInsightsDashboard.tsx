import React from 'react';
import { useCareerContext } from '../context/CareerContext';
import { BarChart, PieChart, TrendingUp } from 'lucide-react';

export const CareerInsightsDashboard: React.FC = () => {
  const { careerInsights, userProfile } = useCareerContext();

  if (!userProfile) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Career Insights Dashboard</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {careerInsights.map((insight, index) => (
          <InsightCard key={index} insight={insight} />
        ))}
      </div>
    </div>
  );
};

const InsightCard = ({ insight }: { insight: any }) => {
  if (!insight || !insight.data) return null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-900 to-teal-800 p-4 text-white">
        <div className="flex items-center">
          {insight.type === 'skillMatch' && <BarChart className="w-5 h-5 mr-2" />}
          {insight.type === 'salaryTrend' && <PieChart className="w-5 h-5 mr-2" />}
          {insight.type === 'industryDemand' && <TrendingUp className="w-5 h-5 mr-2" />}
          <h4 className="font-bold">{insight.title}</h4>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-4">{insight.description}</p>
        
        {insight.type === 'skillMatch' && insight.data.userSkills && insight.data.marketDemand && (
          <div className="space-y-4">
            {insight.data.userSkills.map((skill: any, idx: number) => {
              const marketSkill = insight.data.marketDemand.find(
                (m: any) => m.name === skill.name
              );
              
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{skill.name}</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-1/2">
                      <div className="h-24 relative">
                        <div 
                          className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all duration-500"
                          style={{ height: `${skill.proficiency}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-center mt-1 text-gray-600">Your Proficiency</p>
                      <p className="text-xs text-center font-semibold">{skill.proficiency}%</p>
                    </div>
                    <div className="w-1/2">
                      <div className="h-24 relative">
                        <div 
                          className="absolute bottom-0 w-full bg-green-500 rounded-t-lg transition-all duration-500"
                          style={{ height: `${marketSkill?.demand || 0}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-center mt-1 text-gray-600">Market Demand</p>
                      <p className="text-xs text-center font-semibold">{marketSkill?.demand || 0}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {insight.type === 'salaryTrend' && insight.data.trends && (
          <div className="mt-4">
            <div className="flex flex-wrap justify-center gap-4">
              {insight.data.trends.map((point: any, idx: number) => {
                const percentage = (point.salary / 3500000) * 100;
                return (
                  <div key={idx} className="text-center">
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#eee"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="3"
                          strokeDasharray={`${percentage}, 100`}
                        />
                        <text
                          x="18"
                          y="20.35"
                          className="text-xs"
                          textAnchor="middle"
                          fill="#2563EB"
                        >
                          {point.year}
                        </text>
                      </svg>
                    </div>
                    <p className="text-sm font-medium mt-2">₹{(point.salary / 100000).toFixed(1)}L</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {insight.type === 'industryDemand' && insight.data.skills && (
          <div className="space-y-4">
            {insight.data.skills.map((skill: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-green-600">{skill.growth}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500 flex items-center px-2"
                    style={{ width: `${skill.demand}%` }}
                  >
                    <span className="text-white text-xs">{skill.demand}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};