import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../redux/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo / Brand */}
          <PetsIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Roboto',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1
            }}
          >
            PetAdopt
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            
            {user ? (
              <>
                 {user.role === 'admin' && (
                    <Button color="inherit" component={Link} to="/admin/dashboard">
                        Admin
                    </Button>
                 )}
                 <Button color="inherit" component={Link} to="/my-applications">
                    My Apps
                 </Button>
                 <Button 
                    color="inherit" 
                    component={Link} 
                    to="/profile"
                    startIcon={<AccountCircle />}
                 >
                    {user.name}
                 </Button>
                 <Button 
                    color="inherit" 
                    variant="outlined" 
                    sx={{ borderColor: 'white', '&:hover': { borderColor: '#eee' } }}
                    onClick={onLogout}
                 >
                    Logout
                 </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button 
                    color="inherit" 
                    component={Link} 
                    to="/register"
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
