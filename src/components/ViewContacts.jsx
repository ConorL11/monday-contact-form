import { useEffect, useState } from "react";
import { List, ListItem } from "@vibe/core";
import ViewContact from "./ViewContact";
import "../App.css";
import { useMondayContext } from "./context";


// function for the entire view when the "View Contacts" tab is selected in the top of the form
function ViewContacts() {

    const { monday, mondayContext } = useMondayContext();
    const [loaded, setLoaded] = useState(null);

    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [isEditing, setIsEditing] = useState(false);


    const cancelEdit = () => {
        setIsEditing(false);
    };

    const startEdit = () =>{
        setIsEditing(true);
    }


    const handleContactClick = (contact) => {
        console.log(contact)
        setSelectedContact(contact);
        cancelEdit();
    };

    // Remove deleted contact from local state
    const handleDeleteContact = (deletedId) => {
        setContacts(contacts.filter(contact => contact.id !== deletedId));
        setSelectedContact(null);
    };

    const handleUpdateContact = (updatedContact) => {
        setContacts(prevContacts => {
            return prevContacts.map(contact =>
                contact.id === updatedContact.id ? updatedContact : contact
            );
        });
        setSelectedContact(updatedContact);
        cancelEdit();
    };
    

    useEffect(() => {
        getContacts();
    }, []);


    // Get Names on the board
    async function getContacts() {
        try {
            const boardId = mondayContext.boardId;
            let query = `query getNames2 {
                boards(ids: ["8337996619"]){
                    items_page(limit:500){
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

            console.log(formattedContacts);
            setContacts(formattedContacts);
        } catch (error) {
            setLoaded(false);
            console.log(error);
        }
    }


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
                                onClick={() => handleContactClick(contact)} 
                                className={`${selectedContact?.id === contact.id ? 'selected-contact' : ''}`}
                                selected={selectedContact?.id === contact.id} 
                            >
                                {contact.firstName} {contact.lastName}
                            </ListItem>
                        ))}
                    </List>
                </div>
                <div className="contact-details-container">
                    <h3>Contact Details</h3>
                    {selectedContact ? (
                        <ViewContact 
                            contacts={contacts} 
                            selectedContact={selectedContact} 
                            isEditing={isEditing} 
                            cancelEdit={() => cancelEdit()} 
                            startEdit={() => {startEdit()}}
                            onDelete={handleDeleteContact}
                            onUpdate={handleUpdateContact} 
                        />
                    ) : (
                        <p>Select a contact to see their details</p>
                    )}
                </div>
            </div>
        )
    }
}

export default ViewContacts