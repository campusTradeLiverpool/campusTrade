import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ConfirmTransaction() {

    // gets transactionID
    const { transactionId } = useParams();

    // state variables for status, confirmation, checking and inzone
    const [status, setStatus] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [checking, setChecking] = useState(false);
    const [inZone, setInZone] = useState(false);

    // gets the user from the local storage and creates a variable for it
    const user = JSON.parse(localStorage.getItem('user'));

    // if the user is not logged in, it sends them to the login page
    useEffect(() => {
    if (!user) {
        localStorage.setItem('redirectAfterLogin', window.location.pathname);
        window.location.href = '/login';
    }
    }, []);

    // function to check the users location
    const checkLocation = () => {
        setChecking(true);

        // gets the users location through the browser
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                // gets the latitude and longitude from the position and sends it to the backend api to check if the user is in a safe zone
                const { latitude, longitude } = position.coords;
                try {
                    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/safezone/validate`, {
                        lat: latitude,
                        lng: longitude
                    });
                    // if the user is in the safe zone, it allows them to confirm the trade, if not it tells them to meet on campus
                    if (response.data.inZone) {
                        setInZone(true);
                        setStatus('You are in a safe zone - you can confirm the trade.');
                    } else {
                        setInZone(false);
                        setStatus('You are not in a University of Liverpool safe zone - please meet on campus to confirm the trade.');
                    }
                } catch (err) {
                    setStatus('Failed to validate location.');
                }
                setChecking(false);
            },
            // if location services are not enabled, it tells the user to enable them
            () => {
                setStatus('We could not get your location - please enable location services.');
                setChecking(false);
            }
        );
    };

    // function to confirm the transaction
    const confirmTransaction = async () => {
        console.log('user object:', user);
        console.log('sellerEmail being sent:', user?.email);
        
        if (!user) {
            setStatus('You need to be logged in. Redirecting...');
            localStorage.setItem('redirectAfterLogin', window.location.pathname);
            window.location.href = '/login';
            return;
        }

        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/api/transactions/seller-confirm/${transactionId}`,
                { sellerEmail: user.email }
            );
            setConfirmed(true);
            setStatus('Transaction confirmed! Both users have been emailed the details.');
        } catch (err) {
            console.log('error response:', err.response?.data);
            setStatus('Failed to confirm transaction.');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Verify Transaction</h2>
            <p>You have been asked to verify a sale - the details should be in the email that you accessed this link from. You will need to be in a University of Liverpool safe zone to verify.</p>

            {!confirmed && (
                <div style={styles.actions}>
                    <button style={styles.checkBtn} onClick={checkLocation} disabled={checking}>Verify Location</button>
                    {inZone && (
                        <button style={styles.confirmBtn} onClick={confirmTransaction}>Confirm Trade</button>
                    )}
                </div>
            )}

            {status && <p style={styles.status}>{status}</p>}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '600px',
        margin: '80px auto',
        padding: '40px',
        textAlign: 'left'
    },
    actions: { display: 'flex', gap: '16px', justifyContent: 'left', marginTop: '24px' },
    checkBtn: {
        padding: '12px 24px',
        backgroundColor: '#050505',
        color: 'white',
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer'
    },
    confirmBtn: {
        padding: '12px 24px',
        backgroundColor: '#e8514a',
        color: 'white',
        border: 'none',
        fontSize: '16px',
        cursor: 'pointer'
    },
    
};

export default ConfirmTransaction;