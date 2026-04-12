import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ConfirmTransaction() {
    const { transactionId } = useParams();
    const [status, setStatus] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [checking, setChecking] = useState(false);
    const [inZone, setInZone] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) { window.location.href = '/login'; }
    }, []);

    const checkLocation = () => {
        setChecking(true);
        setStatus('Getting your location...');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await axios.post('http://localhost:8080/api/safezone/validate', {
                        lat: latitude,
                        lng: longitude
                    });
                    if (response.data.inZone) {
                        setInZone(true);
                        setStatus('✅ You are in a safe zone! You can confirm the transaction.');
                    } else {
                        setInZone(false);
                        setStatus('❌ You are not in a University of Liverpool safe zone.');
                    }
                } catch (err) {
                    setStatus('Failed to validate location.');
                }
                setChecking(false);
            },
            () => {
                setStatus('❌ Location access denied.');
                setChecking(false);
            }
        );
    };

    const confirmTransaction = async () => {
        try {
            await axios.post(`http://localhost:8080/api/transactions/seller-confirm/${transactionId}`, {
                sellerEmail: user.email
            });
            setConfirmed(true);
            setStatus('✅ Transaction confirmed! Both users have been emailed and the listing has been removed.');
        } catch (err) {
            setStatus('Failed to confirm transaction.');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Confirm Transaction</h2>
            <p>You have been asked to confirm a sale. Please check your location first to verify you are in a University of Liverpool safe zone.</p>

            {!confirmed && (
                <div style={styles.actions}>
                    <button style={styles.checkBtn} onClick={checkLocation} disabled={checking}>
                        {checking ? 'Checking...' : 'Check My Location'}
                    </button>
                    {inZone && (
                        <button style={styles.confirmBtn} onClick={confirmTransaction}>
                            Confirm Sale
                        </button>
                    )}
                </div>
            )}

            {status && <p style={styles.status}>{status}</p>}

            {confirmed && (
                <button style={styles.homeBtn} onClick={() => window.location.href = '/'}>
                    Back to Home
                </button>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '600px',
        margin: '80px auto',
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center'
    },
    actions: { display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '24px' },
    checkBtn: {
        padding: '12px 24px',
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer'
    },
    confirmBtn: {
        padding: '12px 24px',
        backgroundColor: '#e8514a',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer'
    },
    homeBtn: {
        padding: '12px 24px',
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '24px'
    },
    status: { fontSize: '16px', fontWeight: 'bold', marginTop: '24px' }
};

export default ConfirmTransaction;