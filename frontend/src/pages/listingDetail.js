import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ListingDetail() {
    // gets the listing id 
    const { id } = useParams();

    // states for listing and loading
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);

    // gets the user from local storage
    const user = JSON.parse(localStorage.getItem('user'));

    // gets the listing details from the api and states the listing data
    useEffect(() => {
        axios.get(`http://localhost:8080/api/listings/${id}`)
            .then(res => {
                setListing(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    // function to handle buying the listing by sending the user to the meetup page with the listing id
    const handleBuy = () => {
        if (!user) { window.location.href = '/login'; return; }
        window.location.href = `/meetup/${id}`;
    };

    // function to handle trade by sending the user to the messages page with the seller of the listing
    const handleTrade = () => {
        if (!user) { window.location.href = '/login'; return; }
        window.location.href = `/messages/${listing.seller.email}/${id}`;
    };
    
    if (!listing) return <div style={styles.loading}></div>;

    // checks if the listing belongs to the user
    const isOwnListing = user?.email === listing.seller?.email;

    // function to handle deleting the listing
    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this listing?')) return;
        try {
            // sends a delete request to the backend api 
            await axios.delete(`http://localhost:8080/api/listings/${id}?email=${user.email}`);
            window.location.href = '/';
        } catch (err) {
            // error if there is any issue
            alert('Failed to delete listing');
        }
    };

    return (
        <div style={styles.container}>
            {listing.imageUrl && (
                <img src={listing.imageUrl} alt={listing.title} style={styles.image} />
            )}
            <div style={styles.details}>
                <h2>{listing.title}</h2>
                <h3 style={styles.price}>£{listing.price}</h3>
                <p style={styles.category}>{listing.category}</p>
                <p style={styles.condition}>Condition: {listing.conditionReport}</p>
                <p style={styles.description}>{listing.description}</p>
                <p style={styles.seller}>Seller: {listing.seller?.name}</p>

                {/* buttons to show if the listing is not the users own */}
                {!isOwnListing && (
                    <div style={styles.buttons}>
                        <button style={styles.buyBtn} onClick={handleBuy}>Buy Now</button>
                        <button style={styles.tradeBtn} onClick={handleTrade}>Propose Trade</button>
                    </div>
                )}

                {/* button to show if the listing is the users own */}
                {isOwnListing && (
                    <div>
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
    },
    image: {
        width: '100%',
        maxHeight: '400px',
        marginBottom: '24px'
    },
    deleteBtn: {
    padding: '12px 32px',
    backgroundColor: '#e8514a',
    color: 'white',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    },

}