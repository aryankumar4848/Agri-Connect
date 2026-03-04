import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../features/auth/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'farmer'
  });

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" required 
             onChange={(e) => setFormData({...formData, name: e.target.value})} />
      <input type="email" name="email" placeholder="Email" required 
             onChange={(e) => setFormData({...formData, email: e.target.value})} />
      <input type="password" name="password" placeholder="Password" required 
             onChange={(e) => setFormData({...formData, password: e.target.value})} />
      <select name="userType" onChange={(e) => setFormData({...formData, userType: e.target.value})}>
        <option value="farmer">Farmer</option>
        <option value="buyer">Buyer</option>
      </select>
      <button type="submit">Register</button>
    </form>
  );
};
