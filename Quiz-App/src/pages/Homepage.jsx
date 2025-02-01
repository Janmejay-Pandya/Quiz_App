import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Homepage = () => {
    const navigate = useNavigate();
    const [showInstructions, setShowInstructions] = useState(false);

    function handleStartQuiz() {
        setShowInstructions(true);
    }

    function handleBeginQuiz() {
        setShowInstructions(false);
        navigate("/Quiz");
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute h-32 w-32 rounded-full bg-purple-600/20 -top-8 -left-8 animate-pulse" />
                    <div className="absolute h-24 w-24 rounded-full bg-blue-600/20 top-1/4 right-10 animate-bounce" />
                    <div className="absolute h-40 w-40 rounded-full bg-pink-600/20 bottom-1/4 -left-10 animate-pulse" />
                    <div className="absolute h-28 w-28 rounded-full bg-indigo-600/20 -bottom-8 right-1/4 animate-bounce" />
                </div>

                {/* Main content */}
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 text-center">
                        Knowledge Quest
                    </h1>

                    <p className="text-xl text-purple-200 mb-12 text-center max-w-md">
                        Challenge yourself with our exciting quiz adventure!
                    </p>

                    {/* Start Quiz Button with hover effects */}
                    <button
                        onClick={handleStartQuiz}
                        className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full 
              text-white text-xl font-bold transform transition-all duration-300 
              hover:scale-110 hover:shadow-xl hover:from-purple-600 hover:to-pink-600
              active:scale-95"
                    >
                        <div className="flex items-center gap-2 transition-transform duration-300 group-hover:scale-110">
                            <Play className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" />
                            <span className="transition-transform duration-300 group-hover:scale-110">
                                Start Quiz
                            </span>
                        </div>

                        {/* Glowing effect with better visibility */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full 
                    blur-lg opacity-40 group-hover:opacity-80 transition-all duration-300" />
                    </button>

                    {/* Stats or additional info */}
                    <div className="mt-16 flex gap-8 text-center">
                        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                            <div className="text-2xl font-bold text-white">1000+</div>
                            <div className="text-purple-200">Questions</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                            <div className="text-2xl font-bold text-white">500+</div>
                            <div className="text-purple-200">Players</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                            <div className="text-2xl font-bold text-white">50+</div>
                            <div className="text-purple-200">Topics</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Instructions Modal */}
            {showInstructions && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Quiz Instructions</h2>
                            <button
                                onClick={() => setShowInstructions(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Content with Scrollbar */}
                        <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="space-y-4">
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-purple-900 mb-2">Quiz Format</h3>
                                    <ul className="list-disc pl-4 text-purple-800 space-y-1">
                                        <li>The quiz consists of multiple-choice questions</li>
                                        <li>Each question has 4 possible answers</li>
                                        <li>Only one answer is correct per question</li>
                                    </ul>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-blue-900 mb-2">Timing</h3>
                                    <ul className="list-disc pl-4 text-blue-800 space-y-1">
                                        <li>You have 10 minutes to complete the Quiz</li>
                                        <li>The timer starts when the questions start</li>
                                    </ul>
                                </div>

                                <div className="bg-pink-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-pink-900 mb-2">Scoring</h3>
                                    <ul className="list-disc pl-4 text-pink-800 space-y-1">
                                        <li>Correct answers: 4 points</li>
                                        <li>Incorrect answers: -1 points</li>
                                        <li>Streak of 3: 6 points</li>
                                    </ul>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-green-900 mb-2">Power-Ups</h3>
                                    <ul className="list-disc pl-4 text-green-800 space-y-1">
                                        <li>50-50: Eliminates 2 wrong options</li>
                                        <li>Skip: Current question can be skipped</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="mt-6">
                            <button
                                onClick={handleBeginQuiz}
                                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white 
                             rounded-lg font-semibold transform transition-all duration-200 
                             hover:from-purple-600 hover:to-pink-600 hover:scale-105 
                             active:scale-95"
                            >
                                Lets Begin!
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
export default Homepage;