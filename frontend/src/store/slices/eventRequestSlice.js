import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create event request
export const createEventRequest = createAsyncThunk(
    'eventRequests/create',
    async (requestData, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth.user;
            if (!token) {
                throw new Error('No authentication token found');
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post('/api/event-requests', requestData, config);
            return response.data;
        } catch (error) {
            console.error('Event Request Error:', error);
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                'Failed to submit request. Please try again.'
            );
        }
    }
);

// Get user's event requests
export const getUserEventRequests = createAsyncThunk(
    'eventRequests/getUserRequests',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth.user;

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get('/api/event-requests/me', config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Get all event requests (for organizers)
export const getAllEventRequests = createAsyncThunk(
    'eventRequests/getAll',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth.user;

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get('/api/event-requests', config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Update event request
export const updateEventRequest = createAsyncThunk(
    'eventRequests/update',
    async ({ requestId, updateData }, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth.user;

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.put(`/api/event-requests/${requestId}`, updateData, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

// Add comment to event request
export const addEventRequestComment = createAsyncThunk(
    'eventRequests/addComment',
    async ({ requestId, comment }, { getState, rejectWithValue }) => {
        try {
            const { token } = getState().auth.user;

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post(`/api/event-requests/${requestId}/comments`, { text: comment }, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const eventRequestSlice = createSlice({
    name: 'eventRequests',
    initialState: {
        requests: [],
        userRequests: [],
        isLoading: false,
        error: null,
        success: false,
    },
    reducers: {
        resetEventRequestStatus: (state) => {
            state.error = null;
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create event request
            .addCase(createEventRequest.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createEventRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = true;
                state.userRequests.unshift(action.payload);
            })
            .addCase(createEventRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Get user's event requests
            .addCase(getUserEventRequests.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getUserEventRequests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userRequests = action.payload;
            })
            .addCase(getUserEventRequests.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Get all event requests
            .addCase(getAllEventRequests.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getAllEventRequests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.requests = action.payload;
            })
            .addCase(getAllEventRequests.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Update event request
            .addCase(updateEventRequest.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateEventRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = true;
                state.requests = state.requests.map((request) =>
                    request._id === action.payload._id ? action.payload : request
                );
            })
            .addCase(updateEventRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            // Add comment to event request
            .addCase(addEventRequestComment.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addEventRequestComment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.success = true;
                state.requests = state.requests.map((request) =>
                    request._id === action.payload._id ? action.payload : request
                );
            })
            .addCase(addEventRequestComment.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { resetEventRequestStatus } = eventRequestSlice.actions;
export default eventRequestSlice.reducer; 