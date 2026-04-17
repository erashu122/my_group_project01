import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActivities } from '../services/api';

const ActivityList = ({ refreshTrigger = 0 }) => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try {
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [refreshTrigger]);

  if (!activities.length) {
    return (
      <Typography color="text.secondary">
        No activities yet. Add your first workout above.
      </Typography>
    );
  }

  return (
    <Grid container spacing={2}>
      {activities.map((activity) => (
        <Grid item key={activity.id} xs={12} sm={6} md={4}>
          <Card
            sx={{
              cursor: 'pointer',
              borderRadius: 3,
              boxShadow: 2,
              transition: 'transform .2s ease, box-shadow .2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 5,
              },
            }}
            onClick={() => navigate(`/activities/${activity.id}`)}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{activity.type}</Typography>
              <Typography>Duration: {activity.duration} min</Typography>
              <Typography>Calories: {activity.caloriesBurned}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ActivityList;
