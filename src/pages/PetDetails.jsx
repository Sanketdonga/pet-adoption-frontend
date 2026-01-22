import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPet, resetPet } from '../redux/slices/petSlice';
import { 
    Container, 
    Grid, 
    Typography, 
    Button, 
    Box, 
    Paper, 
    Chip, 
    CircularProgress, 
    Divider,
    TextField
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import axios from '../utils/axios';

const PetDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { pet, isLoading, error } = useSelector((state) => state.pets);
    const { user } = useSelector((state) => state.auth);

    const [applicationMsg, setApplicationMsg] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        dispatch(getPet(id));
        return () => {
            dispatch(resetPet());
        };
    }, [dispatch, id]);

    const handleApply = async () => {
        if (!user) {
            toast.info('Please login to apply for adoption');
            navigate('/login');
            return;
        }

        if (!applicationMsg.trim()) {
            toast.warning('Please tell us why you want to adopt this pet');
            return;
        }

        try {
            setSubmitting(true);
            await axios.post('/api/applications', {
                petId: id,
                message: applicationMsg
            });
            toast.success('Application submitted successfully!');
            setApplicationMsg('');
            navigate('/my-applications');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit application');
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;
    if (error) return <Container sx={{ mt: 5 }}><Typography color="error">{error}</Typography></Container>;
    if (!pet) return <Container sx={{ mt: 5 }}><Typography>Pet not found</Typography></Container>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate(-1)} 
                sx={{ mb: 3 }}
            >
                Back to Pets
            </Button>

            <Grid container spacing={4}>
                {/* Left Side: Images */}
                <Grid item xs={12} md={6}>
                   <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                      <img 
                        src={pet.images && pet.images.length > 0 ? pet.images[0] : 'https://via.placeholder.com/600x400?text=No+Image'} 
                        alt={pet.name} 
                        style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover' }}
                      />
                   </Paper>
                   {/* If multiple images, thumbnail gallery could go here */}
                   {pet.images && pet.images.length > 1 && (
                       <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto' }}>
                           {pet.images.map((img, index) => (
                               <img 
                                key={index} 
                                src={img} 
                                alt={`${pet.name}-${index}`} 
                                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                               />
                           ))}
                       </Box>
                   )}
                </Grid>

                {/* Right Side: Info */}
                <Grid item xs={12} md={6}>
                    <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h3" fontWeight="bold" color="primary">
                                {pet.name}
                            </Typography>
                            <Chip 
                                label={pet.status} 
                                color={pet.status === 'Available' ? 'success' : 'error'} 
                                sx={{ fontSize: '1rem', px: 1 }}
                            />
                        </Box>
                        
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            {pet.breed} • {pet.species}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid item xs={6} sm={4}>
                                <Typography variant="subtitle2" color="text.secondary">Age</Typography>
                                <Typography variant="h6">{pet.age} Years</Typography>
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <Typography variant="subtitle2" color="text.secondary">Gender</Typography>
                                <Typography variant="h6">{pet.gender}</Typography>
                            </Grid>
                             <Grid item xs={6} sm={4}>
                                <Typography variant="subtitle2" color="text.secondary">Added</Typography>
                                <Typography variant="body1">{new Date(pet.createdAt).toLocaleDateString()}</Typography>
                            </Grid>
                        </Grid>

                        <Box sx={{ mb: 4 }}>
                            <Typography variant="h6" gutterBottom>About {pet.name}</Typography>
                            <Typography variant="body1" paragraph style={{whiteSpace: 'pre-line'}}>
                                {pet.description}
                            </Typography>
                        </Box>

                        {/* Adoption Action */}
                        {pet.status === 'Available' ? (
                            <Paper elevation={2} sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                                <Typography variant="h6" gutterBottom>Interested in adopting?</Typography>
                                {user ? (
                                    <>
                                        <TextField 
                                            fullWidth
                                            multiline
                                            rows={3}
                                            label="Why do you want to adopt this pet?"
                                            variant="outlined"
                                            value={applicationMsg}
                                            onChange={(e) => setApplicationMsg(e.target.value)}
                                            sx={{ mb: 2, bgcolor: 'white' }}
                                        />
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            size="large" 
                                            fullWidth
                                            onClick={handleApply}
                                            disabled={submitting}
                                        >
                                            {submitting ? 'Submitting...' : 'Apply for Adoption'}
                                        </Button>
                                    </>
                                ) : (
                                    <Button 
                                        variant="contained" 
                                        color="secondary" 
                                        size="large" 
                                        fullWidth
                                        onClick={() => navigate('/login')}
                                    >
                                        Login to Adopt
                                    </Button>
                                )}
                            </Paper>
                        ) : (
                             <Paper elevation={1} sx={{ p: 2, bgcolor: '#fff3cd', color: '#856404' }}>
                                <Typography variant="body1" align="center">
                                    This pet has already been adopted or is pending adoption.
                                </Typography>
                            </Paper>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default PetDetails;
