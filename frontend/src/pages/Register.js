import React, { useState } from 'react';
import axios from 'axios';

function Register() {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        dateOfBirth: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await axios.post('http://localhost:8080/api/users/register', formData);
            setMessage(response.data);
        } catch (err) {
            setError(err.response?.data || 'Something went wrong');
        }
    };

    return (
        <div style={styles.container}>
            <title>CampusTrade - Register</title>
            <h2>Create your CampusTrade account</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    style={styles.input}
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    style={styles.input}
                    type="email"
                    name="email"
                    placeholder="University email (.ac.uk)"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    style={styles.input}
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                />
                <button style={styles.button} type="submit">Register</button>
            </form>
            {message && <p style={styles.success}>{message}</p>}
            {error && <p style={styles.error}>{error}</p>}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '400px',
        margin: '80px auto',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
    },
    input: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '14px'
    },
    button: {
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer'
    },
    success: { color: 'green' },
    error: { color: 'red' }
};

export default Register;