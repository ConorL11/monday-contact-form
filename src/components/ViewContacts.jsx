import { useState } from "react";
import { List, ListItem, Loader } from "@vibe/core";
import ContactDetails from "./ContactDetails";
import { useMondayContext } from "./context";
import "../App.css";

function ViewContacts({ contacts, setContacts, isLoading, error, supportedColumnInfo }) {

    // get monday context for boardId and monday SDK
    const { monday } = useMondayContext();

    // state for what the user selects on the contact list
    const [selectedContactId, setSelectedContactId] = useState(null);

    const handleContactClick = (contact) => {
        setSelectedContactId(contact.id);
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
                    {selectedContactId ? 
                        (
                            <ContactDetails contactId={selectedContactId} setContacts={setContacts} supportedColumnInfo={supportedColumnInfo} setSelectedContactId={setSelectedContactId}/>
                        ) : 
                        (
                            <div>
                                <h3>Contact Details</h3>
                                <p>Select a contact to see their details</p>
                            </div>
                        )
                    }
            </div>
        </div>
    );
}

export default ViewContacts;
