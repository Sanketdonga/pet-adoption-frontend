import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

// Create application
export const createApplication = createAsyncThunk(
  'applications/create',
  async (appData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/applications', appData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to submit application');
    }
  }
);

// Get my applications
export const getMyApplications = createAsyncThunk(
  'applications/getMy',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/applications/my');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to fetch applications');
    }
  }
);

// Get all applications (Admin)
export const getAllApplications = createAsyncThunk(
  'applications/getAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/applications', { params });
      return response.data;
    } catch (error) {
       return rejectWithValue(error.response.data.message || 'Failed to fetch applications');
    }
  }
);

// Update application status (Admin)
export const updateApplicationStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/applications/${id}`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Failed to update status');
    }
  }
);

const initialState = {
  applications: [],
  pagination: {},
  count: 0,
  isLoading: false,
  error: null,
  success: false,
};

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
    // Useful for socket updates
    updateApplicationInState: (state, action) => {
        state.applications = state.applications.map(app => 
            app._id === action.payload.applicationId 
            ? { ...app, status: action.payload.status } 
            : app
        );
    }
  },
  extraReducers: (builder) => {
    builder
        // Create
      .addCase(createApplication.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.applications.push(action.payload.data);
      })
      .addCase(createApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get My
      .addCase(getMyApplications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload.data;
      })
      .addCase(getMyApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get All
      .addCase(getAllApplications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications = action.payload.data;
        state.pagination = action.payload.pagination;
        state.count = action.payload.count;
      })
      .addCase(getAllApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Status
      .addCase(updateApplicationStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.applications = state.applications.map(app => 
            app._id === action.payload.data._id ? action.payload.data : app
        );
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { reset, updateApplicationInState } = applicationSlice.actions;
export default applicationSlice.reducer;
