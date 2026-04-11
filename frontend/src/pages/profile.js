import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
    const [user, setUser] = useState(null);
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (!stored) {
            window.location.href = '/login';
        } else {
            const parsed = JSON.parse(stored);
            setUser(parsed);
            axios.get(`http://localhost:8080/api/listings/seller/${parsed.email}`)
                .then(res => setListings(res.data))
                .catch(() => {});
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

            <h3 style={styles.listingsTitle}>My Listings</h3>
            {listings.length === 0 ? (
                <p style={styles.empty}>You have no listings yet. <a href="/sell">Create one</a></p>
            ) : (
                <div style={styles.grid}>
                    {listings.map(listing => (
                        <div
                            key={listing.id}
                            style={styles.listingCard}
                            onClick={() => window.location.href = `/listing/${listing.id}`}
                        >
                            {listing.imageUrl ? (
                                <img src={listing.imageUrl} alt={listing.title} style={styles.image} />
                            ) : (
                                <div style={styles.noImage}>No Image</div>
                            )}
                            <div style={styles.info}>
                                <p style={styles.listingTitle}>{listing.title}</p>
                                <p style={styles.price}>£{listing.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '800px',
        margin: '40px auto',
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
    },
    listingsTitle: {
        marginTop: '40px',
        marginBottom: '16px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '16px'
    },
    listingCard: {
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: 'white'
    },
    image: {
        width: '100%',
        height: '150px',
        objectFit: 'cover'
    },
    noImage: {
        width: '100%',
        height: '150px',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#888'
    },
    info: { padding: '10px' },
    listingTitle: { margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '14px' },
    price: { margin: 0, color: '#e8514a', fontSize: '14px' },
    empty: { color: '#888' }
};

export default Profile;