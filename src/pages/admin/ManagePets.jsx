import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPets, createPet, updatePet, deletePet } from '../../redux/slices/petSlice'; // Ensure deletePet is exported
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Button, 
    Box, 
    IconButton,
    CircularProgress,
    Typography,
    Modal,
    Avatar,
    Pagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PetForm from '../../components/PetForm';
import { toast } from 'react-toastify';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto'
};

const ManagePets = () => {
  const dispatch = useDispatch();
  const { pets = [], isLoading, error, pagination = {} } = useSelector((state) => state.pets || {});
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [currentPet, setCurrentPet] = useState(null); // If null, it's create mode
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    dispatch(getPets({ limit: 10, page })); // Fetch with pagination
  }, [dispatch, page]);

  const handleOpen = (pet = null) => {
      setCurrentPet(pet);
      setOpen(true);
  };

  const handleClose = () => {
      setOpen(false);
      setCurrentPet(null);
  };

  const handleSubmit = async (formData) => {
      setFormLoading(true);
      try {
          if (currentPet) {
              await dispatch(updatePet({ id: currentPet._id, petData: formData })).unwrap();
              toast.success('Pet updated successfully');
          } else {
              await dispatch(createPet(formData)).unwrap();
              toast.success('Pet created successfully');
          }
          handleClose();
      } catch (err) {
          toast.error(err || 'Operation failed');
      } finally {
          setFormLoading(false);
      }
  };

  const handleDelete = async (id) => {
      if (window.confirm('Are you sure you want to delete this pet?')) {
          try {
             await dispatch(deletePet(id)).unwrap();
             toast.success('Pet deleted');
          } catch (err) {
              toast.error(err || 'Failed to delete');
          }
      }
  };

  if (isLoading && !pets.length) return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
        <Box display="flex" justifyContent="flex-end" mb={2}>
            <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={() => handleOpen()}
            >
                Add New Pet
            </Button>
        </Box>
        
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }} aria-label="manage pets table">
                <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Image</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Breed</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Age</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'right' }}>Actions</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {pets.map((pet) => (
                    <TableRow key={pet._id}>
                        <TableCell>
                            <Avatar 
                                src={pet.images && pet.images.length > 0 ? pet.images[0] : ''} 
                                variant="rounded"
                            />
                        </TableCell>
                        <TableCell>{pet.name}</TableCell>
                        <TableCell>{pet.breed}</TableCell>
                        <TableCell>{pet.age}</TableCell>
                        <TableCell>{pet.status}</TableCell>
                        <TableCell align="right">
                            <IconButton color="primary" onClick={() => handleOpen(pet)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDelete(pet._id)}>
                                <DeleteIcon />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>

        {/* Pagination */ }
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
                count={pagination?.pages || 1}
                page={page}
                onChange={(e, v) => setPage(v)}
                color="primary"
            />
        </Box>

        {/* Create/Edit Modal */}
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
                    {currentPet ? 'Edit Pet' : 'Add New Pet'}
                </Typography>
                <PetForm 
                    initialValues={currentPet || {}} 
                    onSubmit={handleSubmit}
                    isLoading={formLoading}
                    isEdit={!!currentPet}
                />
            </Box>
        </Modal>
    </Box>
  );
};

export default ManagePets;
