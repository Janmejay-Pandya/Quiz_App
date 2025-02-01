import { Routes, Route } from "react-router-dom";
import QuizPage from "./pages/QuizPage";
import Homepage from "./pages/Homepage";

function App() {
  return <>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/Quiz" element={<QuizPage />} />
    </Routes>
  </>
}

export default App