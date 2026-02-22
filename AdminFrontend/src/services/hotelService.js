import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const hotelService = {
  getHotels: async () => {
    const response = await axios.get(`${API_URL}/hotels`);
    return response.data;
  },

  getHotelById: async (id) => {
    const response = await axios.get(`${API_URL}/hotels/${id}`);
    return response.data;
  },

  createHotel: async (hotelData) => {
    const response = await axios.post(`${API_URL}/hotels`, hotelData);
    return response.data;
  },

  updateHotel: async (id, hotelData) => {
    const response = await axios.put(`${API_URL}/hotels/${id}`, hotelData);
    return response.data;
  },

  deleteHotel: async (id) => {
    const response = await axios.delete(`${API_URL}/hotels/${id}`);
    return response.data;
  },
};

export default hotelService;
