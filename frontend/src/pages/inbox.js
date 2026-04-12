import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Inbox() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) { window.location.href = '/login'; return; }
        axios.get(`http://localhost:8080/api/messages/inbox/${user.email}`)
            .then(res => {
                setConversations(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div style={styles.loading}>Loading...</div>;

    return (
        <div style={styles.container}>
            <h2>Messages</h2>
            {conversations.length === 0 ? (
                <p style={styles.empty}>No messages yet.</p>
            ) : (
                <div style={styles.list}>
                    {conversations.map((conv, index) => {
                        const otherUser = conv.sender.email === user.email ? conv.receiver : conv.sender;
                        return (
                            <div
                                key={index}
                                style={styles.card}
                                onClick={() => window.location.href = `/messages/${otherUser.email}/${conv.listing.id}`}
                            >
                                <div style={styles.cardInfo}>
                                    <p style={styles.name}>{otherUser.name}</p>
                                    <p style={styles.listing}>Re: {conv.listing.title}</p>
                                    <p style={styles.preview}>{conv.content}</p>
                                </div>
                                <p style={styles.time}>{new Date(conv.sentAt).toLocaleDateString()}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '700px',
        margin: '40px auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },
    list: { display: 'flex', flexDirection: 'column', gap: '12px' },
    card: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        backgroundColor: 'white'
    },
    cardInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
    name: { margin: 0, fontWeight: 'bold', fontSize: '16px' },
    listing: { margin: 0, color: '#e8514a', fontSize: '13px' },
    preview: { margin: 0, color: '#666', fontSize: '13px' },
    time: { margin: 0, color: '#888', fontSize: '12px' },
    loading: { textAlign: 'center', padding: '60px' },
    empty: { color: '#888', textAlign: 'center', padding: '40px' }
};

export default Inbox;