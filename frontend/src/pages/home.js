import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
    const [listings, setListings] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [category, setCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8080/api/listings')
            .then(res => {
                setListings(res.data);
                setFiltered(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filterByCategory = (cat) => {
        setCategory(cat);
        if (cat === 'All') {
            setFiltered(listings);
        } else {
            setFiltered(listings.filter(l => l.category === cat));
        }
    };

    if (loading) return <div style={styles.loading}>Loading listings...</div>;

    return (
        <div>
            <div style={styles.categoryBar}>
                {['All', 'Clothes', 'Homeware', 'Books', 'Other'].map(cat => (
                    <button
                        key={cat}
                        style={{
                            ...styles.categoryBtn,
                            backgroundColor: category === cat ? '#e8514a' : 'white',
                            color: category === cat ? 'white' : 'black'
                        }}
                        onClick={() => filterByCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <p style={styles.empty}>No listings found.</p>
            ) : (
                <div style={styles.grid}>
                    {filtered.map(listing => (
                        <div key={listing.id} style={styles.card}>
                            {listing.imageUrl ? (
                                <img
                                    src={listing.imageUrl}
                                    alt={listing.title}
                                    style={styles.image}
                                />
                            ) : (
                                <div style={styles.noImage}>No Image</div>
                            )}
                            <div style={styles.info}>
                                <h3 style={styles.title}>£{listing.price} — {listing.title}</h3>
                                <p style={styles.category}>{listing.category}</p>
                                <p style={styles.condition}>{listing.conditionReport}</p>
                                <p style={styles.seller}>@{listing.seller?.name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const styles = {
    categoryBar: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        padding: '20px',
        borderBottom: '1px solid #ddd'
    },
    categoryBtn: {
        padding: '8px 20px',
        border: '1px solid #e8514a',
        borderRadius: '20px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '20px',
        padding: '30px'
    },
    card: {
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        backgroundColor: 'white'
    },
    image: {
        width: '100%',
        height: '200px',
        objectFit: 'cover'
    },
    noImage: {
        width: '100%',
        height: '200px',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#888'
    },
    info: {
        padding: '12px'
    },
    title: {
        fontSize: '16px',
        margin: '0 0 4px 0'
    },
    category: {
        color: '#e8514a',
        fontSize: '13px',
        margin: '0 0 4px 0'
    },
    condition: {
        color: '#666',
        fontSize: '13px',
        margin: '0 0 4px 0'
    },
    seller: {
        color: '#888',
        fontSize: '12px',
        margin: 0
    },
    loading: {
        textAlign: 'center',
        padding: '60px',
        fontSize: '18px'
    },
    empty: {
        textAlign: 'center',
        padding: '60px',
        color: '#888'
    }
};

export default Home;