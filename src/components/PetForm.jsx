import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
    TextField, 
    Button, 
    Box, 
    Grid, 
    MenuItem, 
    CircularProgress, 
    Typography,
    IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

const PetForm = ({ initialValues, onSubmit, isLoading, isEdit = false }) => {
    // We need to manage files separately for preview
    const [previewImages, setPreviewImages] = useState([]);
    // For edit mode, we might want to show existing images
    const [existingImagesList, setExistingImagesList] = useState([]);

    useEffect(() => {
        if (initialValues.images && initialValues.images.length > 0) {
            setExistingImagesList(initialValues.images);
        }
    }, [initialValues]);

    const formik = useFormik({
        initialValues: {
            name: initialValues.name || '',
            species: initialValues.species || '',
            breed: initialValues.breed || '',
            age: initialValues.age || '',
            gender: initialValues.gender || 'Male',
            description: initialValues.description || '',
            status: initialValues.status || 'Available',
            images: [], // This will hold new FILES
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            species: Yup.string().required('Required'),
            breed: Yup.string().required('Required'),
            age: Yup.number().required('Required').positive('Must be positive'),
            gender: Yup.string().required('Required'),
            description: Yup.string().required('Required'),
        }),
        onSubmit: (values) => {
             // Prepare FormData
             const formData = new FormData();
             formData.append('name', values.name);
             formData.append('species', values.species);
             formData.append('breed', values.breed);
             formData.append('age', values.age);
             formData.append('gender', values.gender);
             formData.append('description', values.description);
             formData.append('status', values.status);

             // Handle existing images logic for Edit
             if (isEdit) {
                 existingImagesList.forEach(img => formData.append('existingImages', img));
             }

             // Append new images
             if (values.images) {
                 Array.from(values.images).forEach((file) => {
                     formData.append('images', file);
                 });
             }

             onSubmit(formData);
        },
    });

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files) {
            formik.setFieldValue('images', files);
            
            // Generate previews
            const previews = Array.from(files).map(file => URL.createObjectURL(file));
            setPreviewImages(previews);
        }
    };

    const removeExistingImage = (imgUrl) => {
        setExistingImagesList(prev => prev.filter(img => img !== imgUrl));
    };

    return (
        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="name"
                        required
                        fullWidth
                        label="Pet Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                     <TextField
                        select
                        name="species"
                        fullWidth
                        label="Species"
                        value={formik.values.species}
                        onChange={formik.handleChange}
                        error={formik.touched.species && Boolean(formik.errors.species)}
                        helperText={formik.touched.species && formik.errors.species}
                    >
                        <MenuItem value="Dog">Dog</MenuItem>
                        <MenuItem value="Cat">Cat</MenuItem>
                        <MenuItem value="Bird">Bird</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                </Grid>
                 <Grid item xs={12} sm={6}>
                    <TextField
                        name="breed"
                        required
                        fullWidth
                        label="Breed"
                        value={formik.values.breed}
                        onChange={formik.handleChange}
                        error={formik.touched.breed && Boolean(formik.errors.breed)}
                        helperText={formik.touched.breed && formik.errors.breed}
                    />
                </Grid>
                <Grid item xs={6} sm={3}>
                    <TextField
                        name="age"
                        required
                        fullWidth
                        label="Age (Years)"
                        type="number"
                        value={formik.values.age}
                        onChange={formik.handleChange}
                        error={formik.touched.age && Boolean(formik.errors.age)}
                        helperText={formik.touched.age && formik.errors.age}
                    />
                </Grid>
                 <Grid item xs={6} sm={3}>
                     <TextField
                        select
                        name="gender"
                        fullWidth
                        label="Gender"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                    >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                    </TextField>
                </Grid>
                
                {isEdit && (
                     <Grid item xs={12}>
                        <TextField
                            select
                            name="status"
                            fullWidth
                            label="Status"
                            value={formik.values.status}
                            onChange={formik.handleChange}
                        >
                            <MenuItem value="Available">Available</MenuItem>
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Adopted">Adopted</MenuItem>
                        </TextField>
                    </Grid>
                )}

                <Grid item xs={12}>
                    <TextField
                        name="description"
                        required
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                    />
                </Grid>

                 {/* Existing Images (Edit Mode) */}
                 {isEdit && existingImagesList.length > 0 && (
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>Existing Images:</Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {existingImagesList.map((img, index) => (
                                <Box key={index} position="relative">
                                    <img src={img} alt="pet" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }} />
                                    <IconButton 
                                        size="small" 
                                        sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'background.paper' }}
                                        onClick={() => removeExistingImage(img)}
                                    >
                                        <CloseIcon fontSize="small" color="error" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                )}

                {/* Image Upload */}
                <Grid item xs={12}>
                    <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        sx={{ mb: 1 }}
                    >
                        Upload {isEdit ? 'New' : ''} Images
                        <input
                            type="file"
                            hidden
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </Button>
                    
                    {/* New Previews */}
                    {previewImages.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                            {previewImages.map((src, index) => (
                                <img key={index} src={src} alt="preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                            ))}
                        </Box>
                    )}
                </Grid>
            </Grid>

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
            >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : (isEdit ? 'Update Pet' : 'Create Pet')}
            </Button>
        </Box>
    );
};

export default PetForm;
