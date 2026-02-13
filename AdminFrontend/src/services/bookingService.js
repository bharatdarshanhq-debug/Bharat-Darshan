import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from local storage
const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

// Configure axios instance with auth header
const authAxios = axios.create({
  baseURL: API_URL,
});

authAxios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Get all bookings
export const getAllBookings = async (page = 1, limit = 10) => {
  try {
    const response = await authAxios.get('/bookings', {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch bookings';
  }
};

// Get booking by ID
export const getBookingById = async (id) => {
  try {
    const response = await authAxios.get(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch booking details';
  }
};

// Create manual booking
export const createManualBooking = async (bookingData) => {
  try {
    const response = await authAxios.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to create booking';
  }
};

// Update booking status
export const updateBookingStatus = async (id, statusData) => {
  try {
    const response = await authAxios.put(`/bookings/${id}/status`, statusData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to update booking status';
  }
};

// Delete booking
export const deleteBooking = async (id) => {
  try {
    const response = await authAxios.delete(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to delete booking';
  }
};
