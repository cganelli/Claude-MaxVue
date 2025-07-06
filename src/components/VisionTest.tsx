import React, { useState } from "react";
import { Play, RotateCcw, Check, AlertCircle } from "lucide-react";

const VisionTest = () => {
  const [currentTest, setCurrentTest] = useState(0);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isTestActive, setIsTestActive] = useState(false);

  const tests = [
    {
      title: "Visual Acuity Test",
      description: "Read the letters from top to bottom",
      lines: [
        { size: "text-6xl", letters: "E" },
        { size: "text-5xl", letters: "F P" },
        { size: "text-4xl", letters: "T O Z" },
        { size: "text-3xl", letters: "L P E D" },
        { size: "text-2xl", letters: "F E D F C Z P" },
        { size: "text-xl", letters: "F E L O P Z D" },
        { size: "text-lg", letters: "D F P O T E C" },
      ],
    },
    {
      title: "Color Vision Test",
      description: "What number do you see in the circle?",
      circles: [
        { colors: ["bg-red-400", "bg-green-400"], number: "8" },
        { colors: ["bg-orange-400", "bg-yellow-400"], number: "3" },
        { colors: ["bg-blue-400", "bg-purple-400"], number: "5" },
      ],
    },
  ];

  const startTest = () => {
    setIsTestActive(true);
    setTestResults([]);
  };

  const recordResult = (result: string) => {
    setTestResults([...testResults, result]);
  };

  const resetTest = () => {
    setIsTestActive(false);
    setTestResults([]);
    setCurrentTest(0);
  };

  return (
    <section id="vision-test" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Quick Vision Screening
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take our preliminary vision test to get an initial assessment of
            your eyesight. Note: This is not a substitute for a comprehensive
            eye exam.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {!isTestActive ? (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Eye className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Ready to Test Your Vision?
                </h3>
                <p className="text-gray-600">
                  Sit about 3 feet from your screen in good lighting. Cover one
                  eye and read the chart.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-left">
                      <h4 className="font-semibold text-yellow-800">
                        Important Note
                      </h4>
                      <p className="text-yellow-700 text-sm">
                        This screening is for informational purposes only and
                        cannot replace a comprehensive eye examination by a
                        qualified eye care professional.
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={startTest}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Play className="h-5 w-5" />
                  <span>Start Vision Test</span>
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {tests[currentTest].title}
                  </h3>
                  <button
                    onClick={resetTest}
                    className="text-gray-500 hover:text-gray-700 flex items-center space-x-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>Reset</span>
                  </button>
                </div>

                <p className="text-gray-600 text-center">
                  {tests[currentTest].description}
                </p>

                {currentTest === 0 && (
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-8 text-center space-y-4">
                    {tests[currentTest].lines.map((line, index) => (
                      <div
                        key={index}
                        className={`${line.size} font-mono font-bold text-gray-900 tracking-wider`}
                      >
                        {line.letters}
                      </div>
                    ))}
                  </div>
                )}

                {currentTest === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {tests[currentTest].circles?.map((circle, index) => (
                      <div key={index} className="text-center">
                        <div className="w-32 h-32 rounded-full mx-auto mb-4 relative overflow-hidden border-4 border-gray-300">
                          <div
                            className={`absolute inset-0 ${circle.colors[0]} opacity-60`}
                          ></div>
                          <div
                            className={`absolute inset-4 ${circle.colors[1]} opacity-80 rounded-full`}
                          ></div>
                          <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-gray-800">
                            {circle.number}
                          </div>
                        </div>
                        <button
                          onClick={() => recordResult(circle.number)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                          I see {circle.number}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                      <Check className="h-4 w-4" />
                      <span>Can see clearly</span>
                    </button>
                    <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                      Having difficulty
                    </button>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Ready for a Professional Exam?
                    </h4>
                    <p className="text-blue-700 mb-4">
                      Schedule a comprehensive eye examination for accurate
                      diagnosis and personalized treatment options.
                    </p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Schedule Eye Exam
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionTest;
