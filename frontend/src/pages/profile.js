import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
    // states for the user and the listings
    const [user, setUser] = useState(null);
    const [listings, setListings] = useState([]);

    // gets the user from local storage and if there is no user it sends them to the login page
    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (!stored) {
            window.location.href = '/login';
        } else {
            // if there is a user it sets the user state to the user and then gets the listings for that user and sets the listings state to those listings
            const parsed = JSON.parse(stored);
            setUser(parsed);
            axios.get(`http://localhost:8080/api/listings/seller/${parsed.email}`)
                .then(res => setListings(res.data))
                .catch(() => {});
        }
    }, []);

    // function to log the user out by removing the user from local storage and sending them to the login page
    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    if (!user) return null;

    return (
        <div style={styles.container}>
            <h2>campusTrade Profile:</h2>
            <div style={styles.card}>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <p>Date of Birth: {user.dateOfBirth}</p>
            </div>
            <button style={styles.button} onClick={handleLogout}>Logout</button>

            <h3 style={styles.listingsTitle}>My Listings: </h3>
            {/* if the user has no listings it shows a message and if they do it shows them in a grid */}
            {listings.length === 0 ? (
                <p style={styles.empty}>You have no listings yet. Why not <a href="/sell">upload one?</a></p>
            ) : (   
                // maps through the listings and creates a card for each listing that shows the image, title and price and when you click on it it takes you to the listing detail page for that listing
                <div style={styles.grid}>
                    {listings.map(listing => (
                        <div
                            key={listing.id}
                            style={styles.listingCard}
                            onClick={() => window.location.href = `/listing/${listing.id}`}
                        >   
                        // if the listing has an image it shows the image and if it doesn't it shows a placeholder
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
        background: '#e8514a',
        padding: '24px',
        borderRadius: '4px',
        marginBottom: '8px',
        color: 'white'
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
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: '#e8514a'
    },
    image: {
        width: '100%',
        height: '150px',
    },
    noImage: {
        width: '100%',
        height: '150px',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: { padding: '10px' },
    listingTitle: { margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '14px' },
    price: { margin: 0, color: 'black', fontSize: '14px' },
    empty: { color: '#888' }
};

export default Profile;