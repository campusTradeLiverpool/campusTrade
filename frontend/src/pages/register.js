import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

function Register() {
    // state for the form data
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        dateOfBirth: '',
        password: ''
    });

    // sets states for the success message and the errors
    const [message, setMessage] = useState('');
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

    // function to handle the register, it sends a post request to the sql with the data provided and if successful it sets a success message and if not it sets an error message
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            const response = await axios.post('http://localhost:8080/api/users/register', formData);
            setMessage(response.data);
        } catch (err) {
            setError(err.response?.data || 'Something went wrong, try again later.');
        }
    };

    {/* basic registration form with name, email, date of birth and password */}
    return (
        <div style={styles.container}>
            <h2>Create your campusTrade account!</h2>
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
                    placeholder="University Email (ends in .ac.uk)"
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
            <p>Already have an account? <a href="/login">Login here</a></p>
            {message && <p style={styles.success}>{message}</p>}
            {error && <p style={styles.error}>{error}</p>}
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

export default Register;
