// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_URL}/api/auth/login`,
  REGISTER: `${API_URL}/api/auth/register`,
  
  // Compounds
  COMPOUNDS: `${API_URL}/api/compounds`,
  COMPOUND_BY_ID: (id) => `${API_URL}/api/compounds/${id}`,
  
  // Papers
  PAPERS: `${API_URL}/api/papers`,
  PAPER_BY_ID: (id) => `${API_URL}/api/papers/${id}`,
  
  // Synthesis
  SYNTHESIS: `${API_URL}/api/synthesis`,
  SYNTHESIS_BY_ID: (id) => `${API_URL}/api/synthesis/${id}`,
  
  // AI
  AI_EXPLAIN: `${API_URL}/api/ai/explain`,
  
  // Contributions
  CONTRIBUTIONS_SUBMIT: `${API_URL}/api/contributions/submit`,
  
  // Paper Upload
  PAPER_UPLOAD_PARSE: `${API_URL}/api/paper-upload/parse`,
  PAPER_UPLOAD_SAVE: `${API_URL}/api/paper-upload/save`,
  PAPER_UPLOAD_HISTORY: `${API_URL}/api/paper-upload/history`,
  
  // Research
  RESEARCH: `${API_URL}/api/research`,
};

export default API_URL;
