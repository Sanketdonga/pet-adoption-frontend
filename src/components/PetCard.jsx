import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Placeholder if we had location
import VerifiedIcon from '@mui/icons-material/Verified';

const PetCard = ({ pet }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4
        }
      }}
    >
      <CardMedia
        component="img"
        height="220"
        image={pet.images && pet.images.length > 0 ? pet.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={pet.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            {pet.name}
            </Typography>
            <Chip 
                label={pet.status} 
                color={pet.status === 'Available' ? 'success' : pet.status === 'Adopted' ? 'error' : 'warning'} 
                size="small" 
                variant="outlined"
            />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
           <strong>Breed:</strong> &nbsp; {pet.breed}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
           <strong>Age:</strong> &nbsp; {pet.age} years
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
           <strong>Gender:</strong> &nbsp; {pet.gender}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {pet.description}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            component={Link} 
            to={`/pets/${pet._id}`}
            sx={{ borderRadius: 2 }}
        >
          View Details
        </Button>
      </Box>
    </Card>
  );
};

export default PetCard;
