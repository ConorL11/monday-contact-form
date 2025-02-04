import { useEffect, useState } from "react";
import { List, ListItem } from "@vibe/core";
import ViewContact from "./ViewContact";
import "../App.css";
import mondaySdk from "monday-sdk-js";

function ViewContacts() {
    const monday = mondaySdk();
    const [loaded, setLoaded] = useState(null);

    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [isEditing, setIsEditing] = useState(false);


    useEffect(() => {
        if (contacts.length === 0) {
            getContacts();
        }
    }, [contacts]);

    // Get Names on the board
    async function getContacts() {
        try {
            const context = (await monday.get('context'));
            const boardId = context.data.boardId;
            let query = `query getNames2 {
                boards(ids: ["8337996619"]){
                    items_page{
                        items {
                            id,
                            name,
                            column_values(ids:["text_mkmmh4rt","text_mkmmhp5z", "status"]){
                                id,
                                text
                            }
                        }
                    }
                }
            }`;
            const variables =  { boardId };
            const response = await monday.api(query, { variables });
            const contactsRaw = response.data.boards[0].items_page.items;

            // Format contacts so they fit with the Dropdown component
            const formattedContacts = contactsRaw.map(contact => ({
                id: contact.id,
                name: contact.name,
                firstName: contact.column_values[0]?.text,
                lastName: contact.column_values[1]?.text, 
                status: contact.column_values[2]?.text, 
            }));

            setContacts(formattedContacts);
        } catch (error) {
            setLoaded(false);
            console.log(error);
        }
    }

    const handleContactClick = (contact) => {
        setSelectedContact(contact);
        setIsEditing(false);
    };

    if(loaded === false){
        return (
            <div>A loading error occurred</div>
        )
    } else {
        return (
            <div className="view-contacts-container">
                <div className="contacts-list-container">
                    <List>
                        {contacts.map((contact, index) => (
                            <ListItem 
                                key={contact.id} 
                                onClick={() => handleContactClick(contact)}  // Handle click to set selected contact
                                className={`${selectedContact?.id === contact.id ? 'selected-contact' : ''}`}
                                selected={selectedContact?.id === contact.id} // Mark as selected if it's the current contact
                            >
                                {contact.firstName} {contact.lastName}
                            </ListItem>
                        ))}
                    </List>
                </div>
                <div className="contact-details-container">
                    <h3>Contact Details</h3>
                    {selectedContact ? (
                        <ViewContact selectedContact={selectedContact} isEditing={isEditing} resetEditing={() => setIsEditing(false)} />
                    ) : (
                        <p>Select a contact to see their details</p>
                    )}
                </div>
            </div>

        )
    }
}

export default ViewContacts