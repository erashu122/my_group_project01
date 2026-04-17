import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { useState } from 'react';
import { addActivity } from '../services/api';

const ActivityForm = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    type: 'RUNNING',
    duration: '',
    caloriesBurned: '',
    additionalMetrics: {},
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addActivity(activity);
      onActivityAdded();
      setActivity({ type: 'RUNNING', duration: '', caloriesBurned: '', additionalMetrics: {} });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 1 }}>
      <Stack spacing={2}>
        <FormControl fullWidth>
          <InputLabel>Activity Type</InputLabel>
          <Select
            value={activity.type}
            label="Activity Type"
            onChange={(e) => setActivity({ ...activity, type: e.target.value })}
          >
            <MenuItem value="RUNNING">Running</MenuItem>
            <MenuItem value="WALKING">Walking</MenuItem>
            <MenuItem value="CYCLING">Cycling</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Duration (Minutes)"
          type="number"
          value={activity.duration}
          onChange={(e) => setActivity({ ...activity, duration: e.target.value })}
        />

        <TextField
          fullWidth
          label="Calories Burned"
          type="number"
          value={activity.caloriesBurned}
          onChange={(e) => setActivity({ ...activity, caloriesBurned: e.target.value })}
        />

        <Button type="submit" variant="contained" fullWidth sx={{ py: 1.2 }}>
          Add Activity
        </Button>
      </Stack>
    </Box>
  );
};

export default ActivityForm;
