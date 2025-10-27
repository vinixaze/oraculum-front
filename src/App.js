import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import QuizQuestions from './pages/QuizQuestions';
import Completion from './pages/Completion';
import Trail from './pages/Trail';
import Summary from './pages/Summary';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz/questions" element={<QuizQuestions />} />
        <Route path="/completion" element={<Completion />} />
        <Route path="/trail" element={<Trail />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;