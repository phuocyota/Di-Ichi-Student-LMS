const STORAGE_KEY = 'di-ichi-quiz-attempts';

export function getStoredQuizAttempts(quizId) {
  try {
    const attempts = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return attempts[quizId] ?? [];
  } catch {
    return [];
  }
}

export function saveQuizAttempt(quizId, attempt) {
  try {
    const attempts = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    const nextAttempts = {
      ...attempts,
      [quizId]: [attempt, ...(attempts[quizId] ?? [])],
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAttempts));
  } catch {
    // Local storage can be unavailable in private or restricted browser contexts.
  }
}
