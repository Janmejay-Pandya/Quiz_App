import { useEffect, useState } from "react";
import { Check, AlertCircle, X, Split, SkipForward } from "lucide-react";
import kbc from "/kbc.gif";
import sad from "/sad.jpg";
const API_URL = "http://localhost:5002/api/quiz";


const QuizPage = () => {
    const [quizData, setQuizData] = useState(() => {
        const savedQuizData = localStorage.getItem("quizData");
        return savedQuizData ? JSON.parse(savedQuizData) : [];
    });
    const [streak, setStreak] = useState(0); // To track current streak
    const [bestStreak, setBestStreak] = useState(() => {
        const savedBestStreak = localStorage.getItem("bestStreak");
        return savedBestStreak ? JSON.parse(savedBestStreak) : 0;
    });

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
        const savedIndex = localStorage.getItem("currentQuestionIndex");
        return savedIndex ? JSON.parse(savedIndex) : 0;
    });

    const [showSolutionModal, setShowSolutionModal] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [powerUps, setPowerUps] = useState(() => {
        const savedPowerUps = localStorage.getItem("powerUps");
        return savedPowerUps ? JSON.parse(savedPowerUps) : {
            fiftyFifty: 2,
            skip: 2
        };
    });
    const [removedOptions, setRemovedOptions] = useState([]);
    console.log(removedOptions);

    const [score, setScore] = useState(() => {
        const savedScore = localStorage.getItem("score");
        return savedScore ? JSON.parse(savedScore) : 0;
    });

    const [showResult, setShowResult] = useState(() => {
        return localStorage.getItem("showResult") === "true";
    });
    const [loading, setLoading] = useState(!quizData.length);
    const [error, setError] = useState(null);
    const [answerSubmitted, setAnswerSubmitted] = useState(() => {
        const savedAnswer = localStorage.getItem("answerSubmitted");
        return savedAnswer ? JSON.parse(savedAnswer) : false;
    })

    const [timeRemaining, setTimeRemaining] = useState(() => {
        const savedTime = localStorage.getItem("timeRemaining");
        return savedTime ? JSON.parse(savedTime) : 10 * 60;
    });

    const [timeTaken, setTimeTaken] = useState(() => {
        const savedTimeTaken = localStorage.getItem("timeTaken");
        return savedTimeTaken ? JSON.parse(savedTimeTaken) : 0;
    });

    const [timerActive, setTimerActive] = useState(false);

    useEffect(() => {
        setRemovedOptions([]);
    }, [currentQuestionIndex]);
    useEffect(() => {
        localStorage.setItem("quizData", JSON.stringify(quizData));
        localStorage.setItem("score", JSON.stringify(score));
        localStorage.setItem("currentQuestionIndex", JSON.stringify(currentQuestionIndex));
        localStorage.setItem("timeRemaining", JSON.stringify(timeRemaining));
        localStorage.setItem("timeTaken", JSON.stringify(timeTaken));
        localStorage.setItem("showResult", JSON.stringify(showResult));
        localStorage.setItem("answerSubmitted", JSON.stringify(answerSubmitted));
        localStorage.setItem("powerUps", JSON.stringify(powerUps));
        if (streak > bestStreak) {
            setBestStreak(streak);
            localStorage.setItem("bestStreak", JSON.stringify(streak));
        }
    }, [quizData, score, currentQuestionIndex, timeRemaining, timeTaken, showResult, answerSubmitted, streak, bestStreak, powerUps]);

    useEffect(() => {
        if (quizData.length === 0) {
            fetch(API_URL)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    setQuizData(data.questions);
                    setLoading(false);
                    setTimerActive(true);
                })
                .catch((err) => {
                    setError("Failed to fetch quiz data: " + err.message);
                    setLoading(false);
                });
        } else {
            setLoading(false);
            setTimerActive(true);
        }
    }, [quizData.length]);

    useEffect(() => {
        let interval;
        if (timerActive && timeRemaining > 0 && !showResult) {
            interval = setInterval(() => {
                setTimeRemaining(prev => prev - 1);
                setTimeTaken(prev => prev + 1);
            }, 1000);
        } else if (timeRemaining === 0) {
            setShowResult(true);
            setTimerActive(false);
        }
        return () => clearInterval(interval);
    }, [timerActive, timeRemaining, showResult]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
    const handleAnswerSelect = (option) => {
        if (!answerSubmitted) {
            setSelectedAnswer(option);
        }
    };

    const handleSubmitAnswer = () => {
        if (selectedAnswer !== null && !answerSubmitted) {
            const isCorrect = selectedAnswer.is_correct;
            console.log("isCorrect:", isCorrect);
            if (isCorrect) {
                setStreak(prevStreak => {
                    const newStreak = prevStreak + 1;
                    if (newStreak === 3) {
                        // Add bonus points when streak reaches 3
                        setScore(prevScore => prevScore + 2);
                    }
                    return newStreak;
                });
            } else {
                setStreak(0); // Reset streak if the answer is incorrect
            }
            // Update score
            setScore(prevScore => Math.max(0, prevScore + (isCorrect ? 4 : -1)));
            setAnswerSubmitted(true);
        }
    };
    const handleNextQuestion = () => {
        if (currentQuestionIndex < quizData.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setAnswerSubmitted(false);
        } else {
            setTimerActive(false);
            setShowResult(true);
        }
    };
    const handleViewSolution = () => {
        setShowSolutionModal(true);
    };
    const handleCloseSolutionModal = () => {
        setShowSolutionModal(false);
    };
    const handleFiftyFifty = () => {
        if (powerUps.fiftyFifty > 0 && !answerSubmitted) {
            const incorrectOptions = currentQuestion.options.filter(option => !option.is_correct);
            const shuffledIncorrect = [...incorrectOptions].sort(() => Math.random() - 0.5);
            const optionsToRemove = shuffledIncorrect.slice(0, Math.min(2, incorrectOptions.length));
            setRemovedOptions(optionsToRemove.map(option => option.id));
            setPowerUps(prev => ({
                ...prev,
                fiftyFifty: prev.fiftyFifty - 1
            }));
        }
    };
    const handleSkipQuestion = () => {
        if (powerUps.skip > 0) {
            setPowerUps(prev => ({
                ...prev,
                skip: prev.skip - 1
            }));
            handleNextQuestion();
        }
    };
    if (loading) return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
            <div className="text-white text-2xl">Loading your quiz...</div>
        </div>
    );
    if (error) return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
            <div className="text-white text-xl">Error: {error}</div>
        </div>
    );
    if (showResult) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center text-white">
                    <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
                    <p className="text-xl mb-4">Your final score: {score}</p>
                    <p className="mb-2">Total questions: {quizData.length}</p>
                    <p className="mb-4">Time taken: {formatTime(timeTaken)}</p>
                    {bestStreak === quizData.length && (
                        <div className="mt-4 block  text-white px-4 py-2 rounded-full font-bold text-lg ">
                            <img src={kbc} alt="perfect" />
                        </div>
                    )}
                    {bestStreak === quizData.length ? (
                        <button
                            onClick={() => {
                                window.location.href = "/"; // Redirect to home page
                                localStorage.clear();
                                // window.location.reload();
                            }}
                            className="mt-4 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:scale-105 transition-transform"
                        >
                            Go Home
                        </button>
                    ) : (
                        <div>
                            <div className="mt-4 block  text-white px-4 py-2 rounded-full font-bold text-lg w-300 ">
                                <img src={sad} alt="Sad" width={300} height={300} />
                            </div>
                            <button
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.reload();
                                }}
                                className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold hover:scale-105 transition-transform"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }
    const currentQuestion = quizData[currentQuestionIndex];
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 md:p-8">
            <div className="max-w-4xl mx-auto mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">
                    Knowledge Quest
                </h1>
                <div className="flex justify-between text-white mb-4">
                    <span>Question {currentQuestionIndex + 1}/{quizData.length}</span>
                    <div className="flex gap-4">
                        <span>Score: {score}</span>
                        <span>Streak: {streak}</span> {/* Display current streak */}
                        <span>Best Streak: {bestStreak}</span> {/* Display best streak */}
                        <span className={`${timeRemaining <= 60 ? 'text-red-400 animate-pulse' : ''}`}>
                            Time: {formatTime(timeRemaining)}
                        </span>
                    </div>
                </div>
                <div className="w-full bg-white/10 rounded-full p-2">
                    <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%` }}
                    />
                </div>
            </div>
            {/* Power Ups */}
            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl">
                <div className="flex justify-end gap-4 mb-6">
                    <div className="flex gap-4">
                        <button
                            onClick={handleFiftyFifty}
                            disabled={powerUps.fiftyFifty === 0 || answerSubmitted}
                            className={`flex items-center px-4 py-2 rounded-full font-semibold text-sm
                                ${powerUps.fiftyFifty > 0 && !answerSubmitted
                                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                }`}
                        >
                            <Split className="mr-2 h-4 w-4" />
                            50:50 ({powerUps.fiftyFifty})
                        </button>
                        <button
                            onClick={handleSkipQuestion}
                            disabled={powerUps.skip === 0 || answerSubmitted}
                            className={`flex items-center px-4 py-2 rounded-full font-semibold text-sm
                                ${powerUps.skip > 0 && !answerSubmitted
                                    ? 'bg-purple-500 hover:bg-purple-600 text-white'
                                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                }`}
                        >
                            <SkipForward className="mr-2 h-4 w-4" />
                            Skip ({powerUps.skip})
                        </button>
                    </div>

                </div>
                <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl">
                    <div className="mb-8">
                        <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
                            {currentQuestionIndex + 1}. {currentQuestion.description}
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {currentQuestion.options.map((option, index) => (
                            !removedOptions.includes(option.id) && (
                                <button
                                    key={option.id}
                                    onClick={() => handleAnswerSelect(option)}
                                    disabled={answerSubmitted}
                                    className={`w-full text-left p-4 rounded-xl transition-all duration-200
                    ${selectedAnswer === option && !answerSubmitted
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                            : answerSubmitted
                                                ? option.is_correct
                                                    ? 'bg-green-500 text-white'
                                                    : selectedAnswer === option
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-white/10 text-white opacity-50'
                                                : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                                    {option.description}
                                </button>
                            )
                        ))}
                    </div>
                    <div className="mt-8 flex justify-end gap-4">
                        {!answerSubmitted ? (
                            <button
                                onClick={handleSubmitAnswer}
                                disabled={!selectedAnswer}
                                className={`px-6 py-3 rounded-full font-semibold transition-all duration-200
                            ${selectedAnswer
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105'
                                        : 'bg-white/10 text-white/50 cursor-not-allowed'
                                    }`}
                            >
                                Submit Answer
                            </button>
                        ) : (
                            <>
                                {currentQuestion.detailed_solution && (
                                    <button
                                        onClick={handleViewSolution}
                                        className="px-6 py-3 rounded-full font-semibold transition-all duration-200
                                    bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105 flex items-center"
                                    >
                                        <Check className="mr-2" />
                                        <span>View Solution</span>
                                    </button>
                                )}
                                <button
                                    onClick={handleNextQuestion}
                                    className="px-6 py-3 rounded-full font-semibold transition-all duration-200
                                bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105"
                                >
                                    {currentQuestionIndex === quizData.length - 1 ? 'Finish Quiz' : 'Next Question'}
                                </button>
                            </>
                        )}
                        {showSolutionModal && (
                            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                                <div className="bg-black/40 backdrop-blur-lg rounded-2xl max-w-lg w-full mx-4 relative shadow-2xl border border-white/10">
                                    <button
                                        onClick={handleCloseSolutionModal}
                                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                    <div className="px-6 py-4 border-b border-white/10">
                                        <div className="flex items-center">
                                            {selectedAnswer?.is_correct ? (
                                                <div className="flex items-center text-green-400">
                                                    <Check className="mr-2" size={24} />
                                                    <h3 className="text-xl font-bold">Correct Answer</h3>
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-red-400">
                                                    <AlertCircle className="mr-2" size={24} />
                                                    <h3 className="text-xl font-bold">Explanation</h3>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-6 max-h-[500px] overflow-y-auto">
                                        <p className="text-white/90 text-base leading-relaxed">
                                            {currentQuestion.detailed_solution}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizPage;