import React, { useEffect, useState } from 'react';

function Profile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (!stored) {
            window.location.href = '/login';
        } else {
            setUser(JSON.parse(stored));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    if (!user) return null;

    return (
        <div style={styles.container}>
            <h2>My Profile</h2>
            <div style={styles.card}>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Date of Birth:</strong> {user.dateOfBirth}</p>
                <p><strong>Verified:</strong> {user.verified ? '✅ Yes' : '❌ No'}</p>
            </div>
            <button style={styles.button} onClick={handleLogout}>Logout</button>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '500px',
        margin: '80px auto',
        padding: '40px',
        fontFamily: 'Arial, sans-serif'
    },
    card: {
        background: '#f9f9f9',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '24px',
        lineHeight: '2'
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#e8514a',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer'
    }
};

export default Profile;