/**
 * Default Test Configurations
 * Customize these for your psychology tests
 */

const testConfigurations = {
  IST: {
    name: 'IST (Tes Intelijen Umum)',
    timeLimit: 45,
    totalQuestions: 30,
    passingScore: 70,
    description: 'Tes untuk mengukur kemampuan intelijen umum',
    subcategories: ['SE', 'WA', 'AN', 'GE', 'RA', 'ZR', 'FA', 'WU', 'ME'],
  },
  DISC: {
    name: 'DISC (Behavioral Test)',
    timeLimit: 30,
    totalQuestions: 28,
    passingScore: 60,
    description: 'Tes kepribadian untuk melihat tipe perilaku',
    types: ['D', 'I', 'S', 'C'],
  },
  MBTI: {
    name: 'MBTI (Myers-Briggs Type Indicator)',
    timeLimit: 40,
    totalQuestions: 93,
    passingScore: 0, // MBTI doesn't use pass/fail
    description: 'Tes tipe kepribadian Myers-Briggs',
    types: ['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'],
  },
  EPPS: {
    name: 'EPPS (Edwards Personal Preference Schedule)',
    timeLimit: 50,
    totalQuestions: 225,
    passingScore: 0,
    description: 'Tes preferensi pribadi',
  },
  PAPI: {
    name: 'PAPI Kostick',
    timeLimit: 60,
    totalQuestions: 90,
    passingScore: 70,
    description: 'Tes kepribadian dan preferensi kerja',
  },
  Wartegg: {
    name: 'Wartegg (Tes Grafis)',
    timeLimit: 20,
    totalQuestions: 8,
    passingScore: 0,
    description: 'Tes proyektif grafis',
    type: 'drawing',
  },
  Kraepelin: {
    name: 'Kraepelin / Pauli',
    timeLimit: 10,
    totalQuestions: 100,
    passingScore: 70,
    description: 'Tes kecepatan dan akurasi',
    type: 'numeric',
  },
};

const scoringRules = {
  weighted: {
    name: 'Weighted Scoring',
    description: 'Score based on weight per question',
    formula: 'sum(answer_value * weight)',
  },
  percentage: {
    name: 'Percentage Scoring',
    description: 'Calculate percentage of correct answers',
    formula: '(correct_answers / total_questions) * 100',
  },
  categorical: {
    name: 'Categorical',
    description: 'Assign categories without numerical score',
    formula: 'category_mapping[answer]',
  },
  preference: {
    name: 'Preference Based',
    description: 'Score based on preference selection',
    formula: 'preference_score_map[selection]',
  },
};

const interpretationRules = {
  0: {
    minScore: 0,
    maxScore: 30,
    label: 'Rendah',
    color: '#ef4444',
    recommendation: 'Perlu pengembangan kemampuan ini',
  },
  1: {
    minScore: 31,
    maxScore: 50,
    label: 'Di Bawah Rata-rata',
    color: '#f97316',
    recommendation: 'Pengembangan disarankan',
  },
  2: {
    minScore: 51,
    maxScore: 70,
    label: 'Rata-rata',
    color: '#eab308',
    recommendation: 'Kemampuan standar',
  },
  3: {
    minScore: 71,
    maxScore: 85,
    label: 'Di Atas Rata-rata',
    color: '#22c55e',
    recommendation: 'Kemampuan bagus',
  },
  4: {
    minScore: 86,
    maxScore: 100,
    label: 'Sangat Tinggi',
    color: '#16a34a',
    recommendation: 'Kemampuan excellent',
  },
};

const questionTypes = {
  multiple_choice: { name: 'Pilihan Ganda', icon: '◯' },
  true_false: { name: 'Benar / Salah', icon: '✓' },
  likert_scale: { name: 'Skala Likert', icon: '⬌' },
  image_based: { name: 'Berbasis Gambar', icon: '🖼️' },
  essay: { name: 'Esai', icon: '📝' },
  drawing: { name: 'Gambar', icon: '🎨' },
  forced_choice: { name: 'Pilihan Paksa', icon: '⚖️' },
  numeric: { name: 'Angka', icon: '🔢' },
};

const reportSections = {
  profile: 'Profil Peserta',
  testInfo: 'Informasi Tes',
  scores: 'Skor dan Hasil',
  interpretation: 'Interpretasi',
  strengths: 'Kekuatan',
  development: 'Area Pengembangan',
  recommendation: 'Rekomendasi',
  summary: 'Kesimpulan',
};

module.exports = {
  testConfigurations,
  scoringRules,
  interpretationRules,
  questionTypes,
  reportSections,
};
