import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getActivityDetail } from '../services/api';
import { Box, Card, CardContent, Typography } from '@mui/material';

const ActivityDetail = () => {

  const { id } = useParams();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    getActivityDetail(id)
      .then(res => setActivity(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!activity) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardContent>
          <Typography variant="h5">Activity Detail</Typography>

          <Typography>Type: {activity.activityType}</Typography>
          <Typography>Duration: {activity.duration}</Typography>
          <Typography>Calories: {activity.caloriesBurned}</Typography>
          <Typography>User: {activity.userId}</Typography>

        </CardContent>
      </Card>
    </Box>
  );
};

export default ActivityDetail;