import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
        window.location.href = '/profile';
    }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:8080/api/users/login', formData);
            localStorage.setItem('user', JSON.stringify(response.data));
            window.location.href = '/';
        } catch (err) {
            setError(err.response?.data || 'Invalid email or password');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Login to CampusTrade</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
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
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button style={styles.button} type="submit">Login</button>
            </form>
            {error && <p style={styles.error}>{error}</p>}
            <p>Don't have an account? <a href="/register">Register here</a></p>
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
        backgroundColor: '#e8514a',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer'
    },
    error: { color: 'red' }
};

export default Login;