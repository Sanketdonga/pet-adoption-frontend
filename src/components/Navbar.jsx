import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../redux/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const onLogout = () => {
    handleCloseNavMenu();
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* DESKTOP LOGO */}
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

          {/* MOBILE MENU */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={handleCloseNavMenu} component={Link} to="/">
                <Typography textAlign="center">Home</Typography>
              </MenuItem>
              
              {user ? [
                user.role === 'admin' && (
                  <MenuItem key="admin" onClick={handleCloseNavMenu} component={Link} to="/admin/dashboard">
                    <Typography textAlign="center">Admin</Typography>
                  </MenuItem>
                ),
                <MenuItem key="myapps" onClick={handleCloseNavMenu} component={Link} to="/my-applications">
                  <Typography textAlign="center">My Apps</Typography>
                </MenuItem>,
                <MenuItem key="profile" onClick={handleCloseNavMenu} component={Link} to="/profile">
                   <Box display="flex" alignItems="center" gap={1}>
                       <AccountCircle fontSize="small"/>
                       <Typography textAlign="center">{user.name}</Typography>
                   </Box>
                </MenuItem>,
                <MenuItem key="logout" onClick={onLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              ] : [
                <MenuItem key="login" onClick={handleCloseNavMenu} component={Link} to="/login">
                  <Typography textAlign="center">Login</Typography>
                </MenuItem>,
                <MenuItem key="register" onClick={handleCloseNavMenu} component={Link} to="/register">
                   <Typography textAlign="center">Register</Typography>
                </MenuItem>
              ]}
            </Menu>
          </Box>

          {/* MOBILE LOGO */}
          <PetsIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'Roboto',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            PetAdopt
          </Typography>

          {/* DESKTOP MENU */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
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
