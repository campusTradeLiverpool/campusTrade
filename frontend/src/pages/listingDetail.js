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

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        try {
            await axios.delete(`http://localhost:8080/api/listings/${id}?email=${user.email}`);
            window.location.href = '/';
        } catch (err) {
            alert('Failed to delete listing');
        }
    };

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

                {isOwnListing && (
                    <div>
                        <p style={styles.ownListing}>This is your listing</p>
                        <button style={styles.deleteBtn} onClick={handleDelete}>Delete Listing</button>
                    </div>
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
    deleteBtn: {
    padding: '12px 32px',
    backgroundColor: '#cc0000',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px'
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