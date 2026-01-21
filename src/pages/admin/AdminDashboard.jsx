import React, { useState } from 'react';
import { Container, Grid, Paper, Tabs, Tab, Box, Typography } from '@mui/material';
import ManagePets from './ManagePets';
import ManageApplications from './ManageApplications';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [tabInfo, setTabInfo] = useState(0);

  if (!user || user.role !== 'admin') {
      return <Navigate to="/" replace />;
  }

  const handleChange = (event, newValue) => {
    setTabInfo(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4 }}>
            Admin Dashboard
        </Typography>

        <Paper sx={{ width: '100%', mb: 2 }}>
            <Tabs
                value={tabInfo}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
            >
                <Tab label="Manage Applications" />
                <Tab label="Manage Pets" />
            </Tabs>
        </Paper>

        <Box sx={{ mt: 3 }}>
            {tabInfo === 0 && <ManageApplications />}
            {tabInfo === 1 && <ManagePets />}
        </Box>
    </Container>
  );
};

export default AdminDashboard;
