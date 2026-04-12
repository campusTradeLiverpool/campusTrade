import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

function Login() {

    // state for the form data
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // state for error message
    const [error, setError] = useState('');

    // gets the user from local storage and if there is a user, it sends them to the profile page
    useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
        window.location.href = '/profile';
    }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // function to handle the submit, it sends a post request to the sql with the data provided and if successful it saves the user
    // to the local storage and if not it sets an error message
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
    
    {/* simple login with email and password */}
    return (
        <div style={styles.container}>
            <h2>Login to campusTrade</h2>
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
        maxWidth: '500px',
        margin: '80px auto',
        padding: '40px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    input: {
        padding: '10px',
        fontSize: '16px'
    },
    button: {
        padding: '10px',
        backgroundColor: '#e8514a',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer'
    },
};

export default Login;