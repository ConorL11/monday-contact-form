import { useState } from "react";
import { List, ListItem, Loader } from "@vibe/core";
import ContactDetails from "./ContactDetails";
import { useMondayContext } from "./context";
import "../App.css";

function ViewContacts({ contacts, setContacts, isLoading, error }) {

    // get monday context for boardId and monday SDK
    const { monday } = useMondayContext();

    // state for what the user selects on the contact list
    const [selectedContactId, setSelectedContactId] = useState(null);
    const handleContactClick = (contact) => {
        setSelectedContactId(contact.id);
    };

    const handleDeleteContact = async (contact) => {
            // delete item from API 
        try {
            const contactId = contact.id
            let query = `
                mutation deleteItem($contactId:ID){
                    delete_item (item_id: $contactId) {
                        id
                    }
                }
            `;
            const variables = { contactId };
            await monday.api(query, { variables });
            
            // Remove contact from local state
            setContacts((prevContacts) =>
                prevContacts.filter((contact) => contact.id !== contactId)
            );

            // unselect the deleted contact
            setSelectedContactId(null);

        } catch (error) {
            throw new Error(`Error deleting contact: ${error}`);            
        }
    };

    if (error) return <div>A loading error occurred: {error.message}</div>;

    return (
        <div className="view-contacts-container">
            <div className="contacts-list-container">
                {isLoading ? 
                    (
                        <div className="flexApart">
                            Loading Contacts... <Loader size={25} />
                        </div>
                    ) : 
                    (
                    <List>
                        {contacts.map((contact) => (
                            <ListItem
                                key={contact.id}
                                onClick={() => handleContactClick(contact)}
                                className={`${selectedContactId === contact.id ? "selected-contact" : ""}`}
                                selected={selectedContactId === contact.id}
                            >
                                {contact.name}
                            </ListItem>
                        ))}
                    </List>
                    )
                }
            </div>
            <div className="contact-details-container">
                <h3>Contact Details</h3>
                    {selectedContactId ? 
                        (
                            <ContactDetails contactId={selectedContactId} deleteContact={handleDeleteContact} />
                        ) : 
                        (
                            <p>Select a contact to see their details</p>
                        )
                    }
            </div>
        </div>
    );
}

export default ViewContacts;
