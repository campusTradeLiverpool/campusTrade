import React, { useState } from 'react';
import axios from 'axios';

function Sell() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: '',
        conditionReport: '',
        isbn: ''
    });
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const lookupISBN = async () => {
        if (!formData.isbn) return;
        setLoading(true);
        setMessage('');
        setError('');
        try {
            const response = await axios.get(
                `https://www.googleapis.com/books/v1/volumes?q=isbn:${formData.isbn}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
            );
            const book = response.data.items?.[0]?.volumeInfo;
            if (book) {
                setFormData(prev => ({
                    ...prev,
                    title: book.title || '',
                    description: book.description || '',
                    category: 'Books'
                }));
                setMessage('');
            } else {
                setError('Incorrect ISBN');
            }
        } catch (err) {
            setError('An error occured.');
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            window.location.href = '/login';
            return;
        }
        try {
            let imageUrl = null;

            if (image) {
                const imageData = new FormData();
                imageData.append('file', image);
                const uploadResponse = await axios.post(
                    '${process.env.REACT_APP_API_URL}/api/images/upload',
                    imageData,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
                imageUrl = uploadResponse.data.url;
            }

            await axios.post('${process.env.REACT_APP_API_URL}/api/listings', {
                title: formData.title,
                description: formData.description,
                price: formData.price,
                category: formData.category,
                conditionReport: formData.conditionReport,
                sellerEmail: user.email,
                imageUrl: imageUrl
            });

            setMessage('Listing created successfully!');
            setFormData({
                title: '',
                description: '',
                price: '',
                category: '',
                conditionReport: '',
                isbn: ''
            });
            setImage(null);
            setImagePreview(null);
        } catch (err) {
            const errorMsg = typeof err.response?.data === 'string'
                ? err.response.data
                : 'Something went wrong';
            setError(errorMsg);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Sell an Item</h2>

            <div style={styles.isbnSection}>
                <h3>Have a book? Look it up by ISBN</h3>
                <div style={styles.isbnRow}>
                    <input
                        style={styles.input}
                        type="text"
                        name="isbn"
                        placeholder="Enter ISBN"
                        value={formData.isbn}
                        onChange={handleChange}
                    />
                    <button
                        style={styles.isbnButton}
                        onClick={lookupISBN}
                        disabled={loading}
                    >
                        {loading ? 'Looking up...' : 'Lookup'}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    style={styles.input}
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />
                <textarea
                    style={styles.textarea}
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                />
                <input
                    style={styles.input}
                    type="number"
                    name="price"
                    placeholder="Price (£)"
                    value={formData.price}
                    onChange={handleChange}
                    required
                />
                <select
                    style={styles.input}
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Category</option>
                    <option value="Books">Books</option>
                    <option value="Clothes">Clothes</option>
                    <option value="Homeware">Homeware</option>
                    <option value="Other">Other</option>
                </select>
                <input
                    style={styles.input}
                    type="text"
                    name="conditionReport"
                    placeholder="Condition (e.g. Good, Like New)"
                    value={formData.conditionReport}
                    onChange={handleChange}
                />

                <div style={styles.imageSection}>
                    <label style={styles.imageLabel}>Upload Photo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={styles.preview}
                        />
                    )}
                </div>

                <button style={styles.button} type="submit">Create Listing</button>
            </form>
            {message && <p style={styles.success}>{message}</p>}
            {error && <p style={styles.error}>{error}</p>}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '600px',
        margin: '40px auto',
        padding: '40px',
        fontFamily: 'Arial, sans-serif'
    },
    isbnSection: {
        background: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '24px'
    },
    isbnRow: {
        display: 'flex',
        gap: '10px'
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
        fontSize: '14px',
        width: '100%'
    },
    textarea: {
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '14px',
        width: '100%'
    },
    isbnButton: {
        padding: '10px 20px',
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        whiteSpace: 'nowrap'
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
    imageSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    imageLabel: {
        fontWeight: 'bold'
    },
    preview: {
        width: '200px',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '8px',
        marginTop: '8px'
    },
    success: { color: 'green' },
    error: { color: 'red' }
};

export default Sell;