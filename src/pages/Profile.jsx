import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateDetails, updatePassword, reset } from '../redux/slices/authSlice';
import { 
    Container, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Paper, 
    Grid,
    Divider
} from '@mui/material';
import { toast } from 'react-toastify';

const Profile = () => {
    const dispatch = useDispatch();
    const { user, isLoading, error, success } = useSelector((state) => state.auth);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    
    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(reset());
        }
        if (success) {
            toast.success('Profile updated successfully!');
            dispatch(reset());
            // Clear password fields on success
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        }
    }, [error, success, dispatch]);

    const handleUpdateDetails = (e) => {
        e.preventDefault();
        dispatch(updateDetails({ name, email }));
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            toast.error('New passwords do not match');
            return;
        }
        dispatch(updatePassword({ currentPassword, newPassword }));
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
             <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', mb: 4 }}>
                User Profile
            </Typography>

            <Grid container spacing={4}>
                {/* Update Details Section */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Update Details
                        </Typography>
                        <Box component="form" onSubmit={handleUpdateDetails} noValidate sx={{ mt: 2 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled // Keep email disabled for now if not handling verification
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={isLoading}
                            >
                                Update Profile
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Change Password Section */}
                <Grid item xs={12} md={6}>
                     <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Change Password
                        </Typography>
                        <Box component="form" onSubmit={handleUpdatePassword} noValidate sx={{ mt: 2 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                type="password"
                                label="Current Password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                type="password"
                                label="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                             <TextField
                                margin="normal"
                                required
                                fullWidth
                                type="password"
                                label="Confirm New Password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="secondary"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={isLoading}
                            >
                                Change Password
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Profile;
