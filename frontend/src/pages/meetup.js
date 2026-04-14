import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, useJsApiLoader, Circle, Marker } from '@react-google-maps/api';

const SAFE_ZONES = [
    { lat: 53.4048, lng: -2.9660, name: 'Main Campus' },
    { lat: 53.4063, lng: -2.9663, name: 'Guild of Students' },
    { lat: 53.4034, lng: -2.9656, name: 'Sydney Jones Library' },
    { lat: 53.4051, lng: -2.9634, name: 'Sports Centre' },
];

const containerStyle = { width: '100%', height: '400px' };
const center = { lat: 53.4048, lng: -2.9660 };

function Meetup() {
    const { listingId } = useParams();
    const [listing, setListing] = useState(null);
    const [status, setStatus] = useState('');
    const [inZone, setInZone] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [checking, setChecking] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    });

    useEffect(() => {
        if (!user) { window.location.href = '/login'; return; }
        axios.get(`${process.env.REACT_APP_API_URL}/api/listings/${listingId}`)
            .then(res => setListing(res.data));
    }, []);

    const checkLocation = () => {
        setChecking(true);
        setStatus('Getting your location...');

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });

                try {
                    const response = await axios.post('${process.env.REACT_APP_API_URL}/api/safezone/validate', {
                        lat: latitude,
                        lng: longitude
                    });

                    if (response.data.inZone) {
                        setInZone(true);
                        setStatus('✅ You are in a safe zone! You can confirm the meetup.');
                    } else {
                        setInZone(false);
                        setStatus('❌ You are not in a University of Liverpool safe zone. Please meet on campus.');
                    }
                } catch (err) {
                    setStatus('Failed to validate location.');
                }
                setChecking(false);
            },
            () => {
                setStatus('❌ Location access denied. Please enable location services.');
                setChecking(false);
            }
        );
    };
    
    const confirmMeetup = async () => {
        try {
            await axios.post('${process.env.REACT_APP_API_URL}/api/transactions/buyer-confirm', {
                buyerEmail: user.email,
                sellerEmail: listing.seller.email,
                listingId: String(listingId),
                inSafeZone: String(inZone)
            });
            setStatus('✅ Confirmed! The seller has been emailed to confirm their side.');
        } catch (err) {
            setStatus('Failed to confirm meetup.');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Confirm Meetup</h2>

            {listing && (
                <div style={styles.listingInfo}>
                    <p>Item: <strong>{listing.title}</strong> — £{listing.price}</p>
                    <p>Seller: {listing.seller?.name}</p>
                </div>
            )}

            <div style={styles.infoBox}>
                <h3>Safe Zone Rules</h3>
                <p>Both buyer and seller must meet at one of the designated University of Liverpool safe zones shown on the map below.</p>
            </div>

            {isLoaded && (
                <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
                    {SAFE_ZONES.map((zone, i) => (
                        <React.Fragment key={i}>
                            <Marker position={{ lat: zone.lat, lng: zone.lng }} label={zone.name[0]} />
                            <Circle
                                center={{ lat: zone.lat, lng: zone.lng }}
                                radius={200}
                                options={{
                                    fillColor: '#e8514a',
                                    fillOpacity: 0.2,
                                    strokeColor: '#e8514a',
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2
                                }}
                            />
                        </React.Fragment>
                    ))}
                    {userLocation && (
                        <Marker
                            position={userLocation}
                            icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
                        />
                    )}
                </GoogleMap>
            )}

            <div style={styles.actions}>
                <button
                    style={styles.checkBtn}
                    onClick={checkLocation}
                    disabled={checking}
                >
                    {checking ? 'Checking...' : 'Check My Location'}
                </button>

                {inZone && (
                    <button style={styles.confirmBtn} onClick={confirmMeetup}>
                        Confirm Meetup & Complete Transaction
                    </button>
                )}
            </div>

            {status && <p style={styles.status}>{status}</p>}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '800px',
        margin: '40px auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },
    listingInfo: {
        background: '#f9f9f9',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '20px'
    },
    infoBox: {
        background: '#fff3f3',
        border: '1px solid #e8514a',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '20px'
    },
    actions: {
        display: 'flex',
        gap: '16px',
        marginTop: '20px',
        flexWrap: 'wrap'
    },
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
    status: {
        marginTop: '20px',
        fontSize: '16px',
        fontWeight: 'bold'
    }
};

export default Meetup;