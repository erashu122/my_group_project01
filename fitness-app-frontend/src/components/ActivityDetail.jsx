import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Box, Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { getActivityDetail } from '../services/api';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        const response = await getActivityDetail(id);
        setActivity(response.data);
        setRecommendation(response.data.recommendation);
      } catch (error) {
        console.error(error);
      }
    };

    fetchActivityDetail();
  }, [id]);

  if (!activity) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 1.5, sm: 3 } }}>
      <Button variant="text" sx={{ mb: 1 }} onClick={() => navigate('/activities')}>
        ← Back to Activities
      </Button>

      <Card sx={{ mb: 2, borderRadius: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
            Activity Details
          </Typography>
          <Stack spacing={0.8}>
            <Typography>Type: {activity.type}</Typography>
            <Typography>Duration: {activity.duration} minutes</Typography>
            <Typography>Calories Burned: {activity.caloriesBurned}</Typography>
            <Typography>Date: {new Date(activity.createdAt).toLocaleString()}</Typography>
          </Stack>
        </CardContent>
      </Card>

      {recommendation && (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
              AI Recommendation
            </Typography>

            <Typography variant="h6">Analysis</Typography>
            <Typography paragraph>{activity.recommendation}</Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Improvements</Typography>
            {activity?.improvements?.map((improvement, index) => (
              <Typography key={index} paragraph>
                • {improvement}
              </Typography>
            ))}

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Suggestions</Typography>
            {activity?.suggestions?.map((suggestion, index) => (
              <Typography key={index} paragraph>
                • {suggestion}
              </Typography>
            ))}

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Safety Guidelines</Typography>
            {activity?.safety?.map((safety, index) => (
              <Typography key={index} paragraph>
                • {safety}
              </Typography>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ActivityDetail;
