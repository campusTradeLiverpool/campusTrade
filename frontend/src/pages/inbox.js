import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Inbox() {
    // state for the conversations
    const [conversations, setConversations] = useState([]);

    // gets the user from local storage 
    const user = JSON.parse(localStorage.getItem('user'));

    // if the user isn't logged in, it sends them to the login page
    useEffect(() => {
        if (!user) { window.location.href = '/login'; return; }
        // gets the conversations for the user via the email and shows the converstion data
        axios.get(`http://localhost:8080/api/messages/inbox/${user.email}`)
            .then(res => {
                setConversations(res.data);
            })
    }, []);

    return (
        <div style={styles.container}>
            <h2>Messages</h2>
            {/* if there are no conversations, it shows a message */}
            {conversations.length === 0 ? (
                <p style={styles.empty}>No messages yet - find a item to trade or buy!</p>
            ) : (
                <div style={styles.list}>
                    {/*} maps through the conversations and shows the name of the other user, the title of the listing and a preview of the most recent message */}
                    {conversations.map((conv, index) => {
                        const otherUser = conv.sender.email === user.email ? conv.receiver : conv.sender;
                        return (
                            <div
                                key={index}
                                style={styles.card}
                                
                                // when the user clicks on a conversation, it sends them to the messages page with the other user's email and the listing id as parameters
                                onClick={() => window.location.href = `/messages/${otherUser.email}/${conv.listing.id}`}
                            >   
                                {/* shows the name of the other user with the title and the most recent message sent */}
                                <div style={styles.cardInfo}>
                                    <p style={styles.name}>{otherUser.name} - {conv.listing.title} </p>
                                    <p style={styles.preview}>{conv.content}</p>
                                </div>
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
        maxWidth: '800px',
        margin: '40px auto',
        padding: '20px',
    },
    list: { display: 'flex', flexDirection: 'column', gap: '12px' },
    card: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
    },
    name: { margin: 0, fontWeight: 'bold', fontSize: '16px' },
    preview: { margin: 0, color: '#000000', fontSize: '13px', opacity: 0.5 },
    empty: { color: '#888', textAlign: 'center', padding: '40px' }
};

export default Inbox;