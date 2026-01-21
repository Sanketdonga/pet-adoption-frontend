import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPets } from '../redux/slices/petSlice';
import PetCard from '../components/PetCard';
import { 
    Container, 
    Grid, 
    Typography, 
    TextField, 
    Box, 
    MenuItem, 
    Pagination, 
    CircularProgress,
    InputAdornment,
    Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Home = () => {
  const dispatch = useDispatch();
  const { pets, isLoading, error, pagination } = useSelector((state) => state.pets);

  const [search, setSearch] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [page, setPage] = useState(1);

  // Debounce search could be added here, but for simplicity we'll just use the input
  // Or fetch on Enter/Button click. Let's fetch on change for species and pagination, 
  // and maybe debounce search or separate button? 
  // Let's use effects for simplicity.

  useEffect(() => {
    // Basic debounce for search would be good, but let's just fetch when dependencies change
    // Using a timeout for search to avoid too many requests
    const timer = setTimeout(() => {
        dispatch(getPets({ page, search, species, breed, age, limit: 12 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch, page, search, species, breed, age]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Hero / Header Section */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, color: 'primary.main' }}>
          Find Your New Best Friend
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Browse our available pets and give them a loving home today.
        </Typography>
      </Box>

      {/* Filters & Search */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
                <TextField
                    fullWidth
                    placeholder="Search by name, breed..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1); // Reset to page 1 on new search
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ backgroundColor: '#fff' }}
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <TextField
                    select
                    fullWidth
                    label="Species"
                    value={species}
                    onChange={(e) => {
                        setSpecies(e.target.value);
                        setPage(1);
                    }}
                    SelectProps={{
                        displayEmpty: true,
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    sx={{ backgroundColor: '#fff' }}
                >
                    <MenuItem value="">All Species</MenuItem>
                    <MenuItem value="Dog">Dog</MenuItem>
                    <MenuItem value="Cat">Cat</MenuItem>
                    <MenuItem value="Bird">Bird</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
                 <TextField
                    fullWidth
                    label="Breed"
                    placeholder="e.g. Bulldog"
                    value={breed}
                    onChange={(e) => {
                        setBreed(e.target.value);
                        setPage(1);
                    }}
                    InputLabelProps={{ shrink: true }}
                    sx={{ backgroundColor: '#fff' }}
                />
            </Grid>
             <Grid item xs={12} md={1}>
                 <TextField
                    fullWidth
                    label="Age"
                    type="number"
                    value={age}
                    onChange={(e) => {
                        setAge(e.target.value);
                        setPage(1);
                    }}
                    InputLabelProps={{ shrink: true }}
                    sx={{ backgroundColor: '#fff' }}
                />
            </Grid>
            {/* Could add more filters like age, gender here */}
        </Grid>
      </Paper>

      {/* Content */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress size={60} />
        </Box>
      ) : error ? (
        <Typography color="error" variant="h6" align="center">
            Error: {error}
        </Typography>
      ) : (
        <>
            {pets && pets.length > 0 ? (
                <Grid container spacing={3}>
                    {pets.map((pet) => (
                        <Grid item key={pet._id} xs={12} sm={6} md={4} lg={3}>
                            <PetCard pet={pet} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box textAlign="center" my={5}>
                    <Typography variant="h6" color="text.secondary">
                        No pets found matching your criteria.
                    </Typography>
                </Box>
            )}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Pagination 
                        count={pagination.pages} 
                        page={page} 
                        onChange={handlePageChange} 
                        color="primary" 
                        size="large"
                    />
                </Box>
            )}
        </>
      )}
    </Container>
  );
};

export default Home;
