'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function TestPage() {
  const [sessionData, setSessionData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const router = useRouter();
  const params = useParams();

  // Fetch test data
  useEffect(() => {
    fetchTestData();
  }, [params.sessionId]);

  const fetchTestData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(\`/api/tests/sessions/\${params.sessionId}/questions\`, {
        headers: { Authorization: \`Bearer \${token}\` },
      });

      if (res.ok) {
        const data = await res.json();
        setSessionData(data.session);
        setQuestions(data.questions);
        
        // Initialize answers from existing data
        const initialAnswers = {};
        data.questions.forEach((q) => {
          if (q.userAnswer) {
            initialAnswers[q.id] = {
              selected_option_id: q.userAnswer.selected_option_id,
              answer_text: q.userAnswer.answer_text,
            };
          }
        });
        setAnswers(initialAnswers);

        // Calculate time left
        const startTime = new Date(data.session.start_time);
        const timeLimitMs = data.session.time_limit_minutes * 60 * 1000;
        const elapsedMs = Date.now() - startTime.getTime();
        const remainingMs = Math.max(0, timeLimitMs - elapsedMs);
        setTimeLeft(remainingMs);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          handleSubmitTest();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Auto-save answers
  useEffect(() => {
    const saveAnswers = async () => {
      const token = localStorage.getItem('token');
      
      for (const [questionId, answer] of Object.entries(answers)) {
        try {
          await fetch(\`/api/tests/sessions/\${params.sessionId}/answers\`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: \`Bearer \${token}\`,
            },
            body: JSON.stringify({
              question_id: parseInt(questionId),
              selected_option_id: answer.selected_option_id,
              answer_text: answer.answer_text,
            }),
          });
        } catch (error) {
          console.error('Error saving answer:', error);
        }
      }
      
      setAutoSaveStatus('Tersimpan');
      setTimeout(() => setAutoSaveStatus(''), 2000);
    };

    const timer = setTimeout(saveAnswers, 1000);
    return () => clearTimeout(timer);
  }, [answers, params.sessionId]);

  const handleAnswerChange = (questionId, optionId, optionText) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        selected_option_id: optionId,
        answer_text: optionText,
      },
    }));
  };

  const handleSubmitTest = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(\`/api/tests/sessions/\${params.sessionId}/submit\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: \`Bearer \${token}\`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        router.push('/participant/dashboard');
      }
    } catch (error) {
      console.error('Error submitting:', error);
      setSubmitting(false);
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return \`\${minutes.toString().padStart(2, '0')}:\${seconds.toString().padStart(2, '0')}\`;
  };

  const answeredCount = Object.keys(answers).length;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h1 className="font-bold text-gray-900">{sessionData?.category_name}</h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-xs text-gray-600 uppercase font-medium">Menjawab</p>
                <p className="text-lg font-bold text-blue-600">
                  {answeredCount}/{questions.length}
                </p>
              </div>
              <div className={`text-center px-4 py-2 rounded-lg \${
                timeLeft < 5 * 60 * 1000
                  ? 'bg-red-100'
                  : 'bg-blue-100'
              }`}>
                <p className="text-xs text-gray-600 uppercase font-medium">Waktu Tersisa</p>
                <p className={`text-xl font-bold \${
                  timeLeft < 5 * 60 * 1000 ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {formatTime(timeLeft)}
                </p>
              </div>
              {autoSaveStatus && (
                <p className="text-sm text-green-600 font-medium">{autoSaveStatus}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="space-y-8">
          {questions.map((question, index) => (
            <div
              key={question.id}
              className="card border-l-4 border-blue-600"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-blue-600 text-sm">{index + 1}</span>
                </div>
                <p className="text-lg font-medium text-gray-900 flex-1">
                  {question.question_text}
                </p>
              </div>

              {question.image_url && (
                <div className="mb-6">
                  <img
                    src={question.image_url}
                    alt="Question"
                    className="max-w-lg max-h-64 rounded-lg"
                  />
                </div>
              )}

              <div className="space-y-2">
                {question.options.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.id}
                      checked={answers[question.id]?.selected_option_id === option.id}
                      onChange={() =>
                        handleAnswerChange(
                          question.id,
                          option.id,
                          option.option_text
                        )
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 text-gray-900">{option.option_text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">
                Anda telah menjawab <strong>{answeredCount}</strong> dari <strong>{questions.length}</strong> soal
              </p>
              <button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="btn-secondary"
              >
                {submitting ? 'Mengirim...' : '✓ Selesaikan Tes'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
