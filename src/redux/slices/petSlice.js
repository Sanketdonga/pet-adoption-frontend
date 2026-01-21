import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Get all pets
export const getPets = createAsyncThunk(
  'pets/getAll',
  async (params, { rejectWithValue }) => {
    try {
      // Create a clean params object, removing empty keys
      const cleanParams = Object.keys(params).reduce((acc, key) => {
          if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
              acc[key] = params[key];
          }
          return acc;
      }, {});
      
      const response = await axios.get('/api/pets', { params: cleanParams });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch pets');
    }
  }
);

// Get single pet
export const getPet = createAsyncThunk(
  'pets/getOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/pets/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch pet details');
    }
  }
);

// Create pet (Admin)
export const createPet = createAsyncThunk(
  'pets/create',
  async (petData, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const response = await axios.post('/api/pets', petData, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to create pet');
    }
  }
);

// Update pet (Admin)
export const updatePet = createAsyncThunk(
    'pets/update',
    async ({ id, petData }, { rejectWithValue }) => {
      try {
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
        const response = await axios.put(`/api/pets/${id}`, petData, config);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data.message || 'Failed to update pet');
      }
    }
  );

// Delete pet (Admin)
export const deletePet = createAsyncThunk(
    'pets/delete',
    async (id, { rejectWithValue }) => {
      try {
        await axios.delete(`/api/pets/${id}`);
        return id;
      } catch (error) {
        return rejectWithValue(error.response.data.message || 'Failed to delete pet');
      }
    }
  );

const initialState = {
  pets: [],
  pet: null,
  pagination: {}, // { count, total, pagination: { next, prev } } - adjusting based on API response
  isLoading: false,
  error: null,
  success: false,
};

const petSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
    resetPet: (state) => {
        state.pet = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get All
      .addCase(getPets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pets = action.payload.data;
        state.pagination = action.payload.pagination;
        state.count = action.payload.count;
      })
      .addCase(getPets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get One
      .addCase(getPet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pet = action.payload.data;
      })
      .addCase(getPet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createPet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.pets.push(action.payload.data);
      })
      .addCase(createPet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
       // Update
       .addCase(updatePet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.pet = action.payload.data;
        // Update in list if present
        state.pets = state.pets.map(p => p._id === action.payload.data._id ? action.payload.data : p);
      })
      .addCase(updatePet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deletePet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.pets = state.pets.filter((pet) => pet._id !== action.payload);
      })
      .addCase(deletePet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { reset, resetPet } = petSlice.actions;
export default petSlice.reducer;
