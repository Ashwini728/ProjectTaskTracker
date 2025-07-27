import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const RegisterPage = ({ onRegister }) => {
  const [form, setForm] = useState({ name: '', email: '', role: 'Team Member' });
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = async () => {
    const { name, email, role } = form;

    if (!name || !email) {
      alert("Please fill all fields");
      return;
    }

    if (role === 'Admin') {
      if (email === 'admin@admin.com') {
        onRegister({ role: 'Admin', _id: 'admin-id', email });
      } else {
        alert("Only 'admin@admin.com' is allowed as admin");
      }
      return;
    }

    try {
      const res = await axios.post('http://localhost:4000/api/team', form);
      onRegister(res.data);
      navigate('/dashboard');
    } catch (err) {
      console.error("Error registering:", err);
      alert("Registration failed. Email might already be used.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Internal CSS for dark theme and placeholder styling */}
      <style>{`
        input::placeholder,
        select,
        .form-control::placeholder {
          color: #ccc;
        }
      `}</style>

      <div className="card p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#1e1e1e', border: '1px solid #333' }}>
        <div className="text-center mb-4">
          <i className="bi bi-person-plus-fill" style={{ fontSize: '3rem', color: '#198754' }}></i>
          <h3 className="mt-2 text-white">Create Account</h3>
          <p style={{color:'white'}}>Register</p>
        </div>

        <div className="form-group mb-3">
          <input
            className="form-control"
            type="text"
            placeholder="Enter your full name"
            value={form.name}
            style={{
              backgroundColor: '#2c2c2c',
              border: '1px solid #444',
              color: '#f5f5f5'
            }}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-group mb-3">
          <input
            className="form-control"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            style={{
              backgroundColor: '#2c2c2c',
              border: '1px solid #444',
              color: '#f5f5f5'
            }}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="form-group mb-4">
          <select
            className="form-select"
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            style={{
              backgroundColor: '#2c2c2c',
              border: '1px solid #444',
              color: '#f5f5f5'
            }}
          >
            <option>Team Member</option>
          </select>
        </div>

        <button style={{ backgroundColor: '#0d6efd',border:'none',padding:'0.5rem' }} onClick={handleRegister}>
          Register
        </button>

        <div className="text-center">
          <span style={{color:'white'}}>Already registered?</span>
          <button
            className="btn btn-link p-0 ms-2"
            onClick={handleLogin}
            style={{ fontSize: '0.95rem', color: '#0d6efd' }}
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
