import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';

const PRIORITY_OPTIONS = [
  { value: 'P1', label: 'P1 — High', color: 'var(--color-priority-p1)' },
  { value: 'P2', label: 'P2 — Medium', color: 'var(--color-priority-p2)' },
  { value: 'P3', label: 'P3 — Low', color: 'var(--color-priority-p3)' },
];

function TaskForm({ onSave, initialTask }) {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [dueDate, setDueDate] = useState(initialTask?.due_date || '');
  const [priority, setPriority] = useState(initialTask?.priority || 'P3');
  const [error, setError] = useState(null);

  // Helper to normalize date string to YYYY-MM-DD format
  const normalizeDateString = (dateString) => {
    if (!dateString) return '';
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    // Otherwise, parse and format
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Update form fields when initialTask changes (editing mode)
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setDueDate(normalizeDateString(initialTask.due_date));
      setPriority(initialTask.priority || 'P3');
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('P3');
    }
  }, [initialTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError(null);
    await onSave({ title, description, due_date: dueDate, priority });
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('P3');
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        mb: 2, 
        width: '100%',
        background: 'var(--color-surface)',
        backdropFilter: 'blur(10px)',
        borderRadius: 3,
        boxShadow: '0 8px 32px var(--color-shadow-medium)',
        border: '1px solid var(--color-surface-border)'
      }}
    >
      <Typography 
        variant="subtitle1" 
        sx={{ 
          fontWeight: 600,
          color: 'var(--color-primary)',
          mb: 1.5
        }}
      >
        {initialTask ? 'Edit Task' : 'Add Task'}
      </Typography>
      <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={1.5}>
        <TextField
          id="task-title"
          label="Task Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          variant="outlined"
          fullWidth
          size="small"
          inputProps={{ 'data-testid': 'title-input' }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: 'var(--color-primary)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'var(--color-primary)',
              }
            }
          }}
        />
        <TextField
          id="task-description"
          label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          multiline
          minRows={2}
          variant="outlined"
          fullWidth
          size="small"
          inputProps={{ 'data-testid': 'description-input' }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: 'var(--color-primary)',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'var(--color-primary)',
              }
            }
          }}
        />
        <Box display="flex" gap={1.5}>
          <TextField
            id="task-due-date"
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            variant="outlined"
            fullWidth
            size="small"
            InputLabelProps={{ shrink: true }}
            inputProps={{ 'data-testid': 'due-date-input' }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover fieldset': { borderColor: 'var(--color-primary)' },
                '&.Mui-focused fieldset': { borderColor: 'var(--color-primary)' }
              }
            }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              id="task-priority"
              value={priority}
              label="Priority"
              onChange={e => setPriority(e.target.value)}
              inputProps={{ 'data-testid': 'priority-input' }}
              sx={{
                borderRadius: 2,
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-primary)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--color-primary)' }
              }}
            >
              {PRIORITY_OPTIONS.map(opt => {
                const isSelected = priority === opt.value;
                return (
                  <MenuItem key={opt.value} value={opt.value}>
                    <Box display="flex" alignItems="center" gap={1}
                      sx={{ color: isSelected ? 'var(--color-priority-selected)' : 'var(--color-priority-unselected)', fontWeight: isSelected ? 700 : 400 }}
                    >
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: isSelected ? 'var(--color-priority-selected)' : 'var(--color-priority-unselected)', flexShrink: 0 }} />
                      {opt.label}
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        {error && <Typography color="error" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>{error}</Typography>}
        <Box display="flex" gap={2}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            fullWidth
            data-testid="submit-task"
            startIcon={initialTask ? <SaveIcon /> : <AddIcon />}
            sx={{
              borderRadius: 2,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.95rem',
            }}
          >
            {initialTask ? 'Save Changes' : 'Add Task'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default TaskForm;
