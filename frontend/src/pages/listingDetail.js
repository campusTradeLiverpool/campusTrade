import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ListingDetail() {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        axios.get(`http://localhost:8080/api/listings/${id}`)
            .then(res => {
                setListing(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleBuy = () => {
        if (!user) { window.location.href = '/login'; return; }
        window.location.href = `/meetup/${id}`;
    };

    const handleTrade = () => {
        if (!user) { window.location.href = '/login'; return; }
        window.location.href = `/messages/${listing.seller.email}/${id}`;
    };

    if (loading) return <div style={styles.loading}>Loading...</div>;
    if (!listing) return <div style={styles.loading}>Listing not found.</div>;

    const isOwnListing = user?.email === listing.seller?.email;

    return (
        <div style={styles.container}>
            {listing.imageUrl ? (
                <img src={listing.imageUrl} alt={listing.title} style={styles.image} />
            ) : (
                <div style={styles.noImage}>No Image</div>
            )}
            <div style={styles.details}>
                <h2>{listing.title}</h2>
                <h3 style={styles.price}>£{listing.price}</h3>
                <p style={styles.category}>{listing.category}</p>
                <p style={styles.condition}>Condition: {listing.conditionReport}</p>
                <p style={styles.description}>{listing.description}</p>
                <p style={styles.seller}>Seller: {listing.seller?.name}</p>

                {!isOwnListing && (
                    <div style={styles.buttons}>
                        <button style={styles.buyBtn} onClick={handleBuy}>Buy Now</button>
                        <button style={styles.tradeBtn} onClick={handleTrade}>Propose Trade</button>
                    </div>
                )}

                {isOwnListing && (
                    <p style={styles.ownListing}>This is your listing</p>
                )}
            </div>
        </div>
    );
}

export default ListingDetail;

const styles = {
    container: {
        maxWidth: '800px',
        margin: '40px auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },
    image: {
        width: '100%',
        maxHeight: '400px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginBottom: '24px'
    },
    noImage: {
        width: '100%',
        height: '300px',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        marginBottom: '24px',
    }
}