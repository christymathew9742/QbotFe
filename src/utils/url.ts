export const baseURL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5001/api'
    : 'https://qbotbackend-533766290966.asia-south1.run.app/api';
