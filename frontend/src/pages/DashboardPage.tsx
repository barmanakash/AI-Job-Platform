// frontend/src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, CircularProgress, Paper } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkIcon from '@mui/icons-material/Work';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import { getDashboardMetrics, DashboardMetrics } from '../api/analytics.api';

export const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardMetrics()
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const statCards = [
    { title: 'Total Resumes', value: metrics?.totalResumes || 0, icon: <DescriptionIcon color="primary" fontSize="large" /> },
    { title: 'Jobs Tracked', value: metrics?.totalJobsTracked || 0, icon: <WorkIcon color="secondary" fontSize="large" /> },
    { title: 'Avg Match Score', value: `${metrics?.averageMatchScore || 0}%`, icon: <AutoAwesomeIcon color="warning" fontSize="large" /> },
    { title: 'Conversion Rate', value: `${metrics?.conversionRate || 0}%`, icon: <SendIcon color="success" fontSize="large" /> },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Overview
      </Typography>

      <Grid container spacing={3} mb={4}>
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="textSecondary" variant="subtitle2">
                      {card.title}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} mt={1}>
                      {card.value}
                    </Typography>
                  </Box>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Application Pipeline Overview
        </Typography>
        <Grid container spacing={2}>
          {metrics &&
            Object.entries(metrics.applicationsByStage).map(([stage, count]) => (
              <Grid item xs={6} sm={4} md={2} key={stage}>
                <Box sx={{ p: 2, bgcolor: '#f1f5f9', borderRadius: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                    {stage}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} mt={0.5}>
                    {count}
                  </Typography>
                </Box>
              </Grid>
            ))}
        </Grid>
      </Paper>
    </Box>
  );
};