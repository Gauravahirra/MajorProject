import React from 'react';
import { TextField } from '@mui/material';

const PREDEFINED_QUESTIONS = [
  "What is the academic calendar?",
  "How to check attendance?",
  "How to request leave?",
  "How to view grades?",
  "How to submit assignments?",
  "How to contact support?"
];

function PredefinedQuestionSelector({ setInputMessage }) {
  return (
    <TextField
      select
      label="Select a question"
      value=""
      onChange={e => setInputMessage(e.target.value)}
      fullWidth
      size="small"
      SelectProps={{ native: true }}
      sx={{ mb: 1 }}
    >
      <option value="">-- Choose a predefined question --</option>
      {PREDEFINED_QUESTIONS.map((q, idx) => (
        <option key={idx} value={q}>{q}</option>
      ))}
    </TextField>
  );
}

export default React.memo(PredefinedQuestionSelector);