import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Messages() {
    const { listingId, receiverEmail } = useParams();
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');
    const [listing, setListing] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) { window.location.href = '/login'; return; }
        fetchMessages();
        axios.get(`${process.env.REACT_APP_API_URL}/api/listings/${listingId}`)
            .then(res => setListing(res.data));

        const interval = setInterval(() => {
            fetchMessages();
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const fetchMessages = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/messages/${listingId}/${user.email}`)
            .then(res => setMessages(res.data));
    };

    const handleSend = async () => {
        if (!content.trim()) return;
        try {
            await axios.post('${process.env.REACT_APP_API_URL}/api/messages', {
                senderEmail: user.email,
                receiverEmail: receiverEmail,
                listingId: listingId,
                content: content
            });
            setContent('');
            fetchMessages();
        } catch (err) {
            alert('Failed to send message');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Messages</h2>
            {listing && (
                <div style={styles.listingInfo}>
                    <p>About: <strong>{listing.title}</strong> — £{listing.price}</p>
                </div>
            )}

            <div style={styles.messageBox}>
                {messages.length === 0 ? (
                    <p style={styles.empty}>No messages yet. Start the conversation!</p>
                ) : (
                    messages.map(msg => (
                        <div
                            key={msg.id}
                            style={{
                                ...styles.message,
                                alignSelf: msg.sender.email === user.email ? 'flex-end' : 'flex-start',
                                backgroundColor: msg.sender.email === user.email ? '#e8514a' : '#f0f0f0',
                                color: msg.sender.email === user.email ? 'white' : 'black'
                            }}
                        >
                            <p style={styles.msgContent}>{msg.content}</p>
                            <p style={styles.msgMeta}>{msg.sender.name} · {new Date(msg.sentAt).toLocaleTimeString()}</p>
                        </div>
                    ))
                )}
            </div>

            <div style={styles.inputRow}>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Type a message..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button style={styles.sendBtn} onClick={handleSend}>Send</button>
            </div>

            {listing && (
                <button
                    style={styles.meetupBtn}
                    onClick={() => window.location.href = `/meetup/${listingId}`}
                >
                    Confirm Meetup in Safe Zone
                </button>
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
    listingInfo: {
        background: '#f9f9f9',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '20px'
    },
    messageBox: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '20px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        minHeight: '400px',
        marginBottom: '16px',
        overflowY: 'auto'
    },
    message: {
        maxWidth: '60%',
        padding: '10px 14px',
        borderRadius: '12px'
    },
    msgContent: { margin: '0 0 4px 0' },
    msgMeta: { margin: 0, fontSize: '11px', opacity: 0.7 },
    inputRow: {
        display: 'flex',
        gap: '10px',
        marginBottom: '16px'
    },
    input: {
        flex: 1,
        padding: '10px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '14px'
    },
    sendBtn: {
        padding: '10px 20px',
        backgroundColor: '#e8514a',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    meetupBtn: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer'
    },
    empty: { color: '#888', textAlign: 'center', marginTop: '40px' }
};

export default Messages;