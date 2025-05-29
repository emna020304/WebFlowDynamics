import React from 'react';

const assessmentSections = [
  {
    title: 'Methodology',
    description: 'Approach and framework used for the assessment',
    progress: 75,
  },
  {
    title: 'Risk Assessment',
    description: 'Identification and analysis of potential risks',
    progress: 60,
  },
  {
    title: 'Synthesis',
    description: 'Summary and key findings of the assessment',
    progress: 40,
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-ey-gray-800">Project Assessment Dashboard</h1>
        <p className="mt-2 text-ey-gray-600">Track and manage your assessment progress</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessmentSections.map((section) => (
          <div
            key={section.title}
            className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-ey-yellow hover:transform hover:scale-105 transition-transform duration-200"
          >
            <h2 className="text-xl font-semibold text-ey-gray-800">{section.title}</h2>
            <p className="mt-2 text-ey-gray-600">{section.description}</p>
            
            <div className="mt-4">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-ey-gray-600 bg-ey-gray-200">
                      Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-ey-gray-600">
                      {section.progress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-ey-gray-200">
                  <div
                    style={{ width: `${section.progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-ey-yellow"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-ey-gray-800 mb-4">Integrated Assessment Overview</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-ey-yellow pl-4">
            <h3 className="text-lg font-semibold text-ey-gray-800">Current Status</h3>
            <p className="text-ey-gray-600">All sections are interconnected and progress is tracked holistically</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-ey-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold text-ey-gray-800">Key Findings</h4>
              <ul className="mt-2 space-y-2 text-ey-gray-600">
                <li>• Risk factors identified: 12</li>
                <li>• Critical areas highlighted: 4</li>
                <li>• Recommendations pending: 3</li>
              </ul>
            </div>
            
            <div className="bg-ey-gray-100 p-4 rounded-lg">
              <h4 className="font-semibold text-ey-gray-800">Next Steps</h4>
              <ul className="mt-2 space-y-2 text-ey-gray-600">
                <li>• Complete risk analysis</li>
                <li>• Review methodology alignment</li>
                <li>• Update synthesis report</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}