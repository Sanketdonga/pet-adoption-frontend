import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMyApplications } from '../redux/slices/applicationSlice';
import { 
    Container, 
    Typography, 
    Paper, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Chip,
    Box,
    CircularProgress,
    Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MyApplications = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { applications, isLoading, error } = useSelector((state) => state.applications);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
        navigate('/login');
    } else {
        dispatch(getMyApplications());
    }
  }, [dispatch, user, navigate]);

  if (isLoading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
  if (error) return <Container sx={{ mt: 5 }}><Typography color="error">{error}</Typography></Container>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            My Adoption Applications
        </Typography>

        {applications && applications.length > 0 ? (
            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Pet Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Pet Breed</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Date Applied</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {applications.map((app) => (
                        <TableRow
                        key={app._id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {app.pet ? app.pet.name : 'Unknown Pet'}
                        </TableCell>
                        <TableCell>{app.pet ? app.pet.breed : '-'}</TableCell>
                        <TableCell>
                            <Chip 
                                label={app.status} 
                                color={app.status === 'Approved' ? 'success' : app.status === 'Rejected' ? 'error' : 'warning'} 
                                variant={app.status === 'Pending' ? 'outlined' : 'filled'}
                                size="small"
                            />
                        </TableCell>
                        <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Button 
                                size="small" 
                                color="primary"
                                onClick={() => navigate(app.pet ? `/pets/${app.pet._id}` : '#')}
                            >
                                View Pet
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    You haven't applied for any pets yet.
                </Typography>
                <Button variant="contained" color="secondary" onClick={() => navigate('/')}>
                    Browse Pets
                </Button>
            </Paper>
        )}
    </Container>
  );
};

export default MyApplications;
