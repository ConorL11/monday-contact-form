import { useState, useEffect } from "react";
import { Button, Loader } from "@vibe/core";
import { useMondayContext } from "../utils/context";
import { supportedColumns } from "../utils/constants";
import ContactEditor from "./ContactEditor";

function ContactDetails({ contactId, supportedColumnInfo, setContacts, setSelectedContactId }) {
    
    // get monday context for boardId and monday SDK
    const { monday } = useMondayContext();

    // state for pulling in contact details from selected name in list
    const [contactDetails, setContactDetails] = useState(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(true);
    const [error, setError] = useState(null);

    //state for when a contact is being edited
    const [isEditing, setIsEditing] = useState(false);

    // wrap loadContactDetails in useEffect hook to pull new details on new contact selection
    useEffect(() => {
        loadContactDetails();
    }, [contactId, monday,]);

    async function loadContactDetails() {
        setIsLoadingDetails(true);
        try {
            // can add columnValues here to pull more into form
            const query = `
                query getItemDetails ($contactId:[ID!], $supportedColumns:[String!]) {
                    items (ids:$contactId){
                        id, 
                        name,
                        column_values(ids:$supportedColumns){
                            id, 
                            text,
                            type,
                            column {
                                title
                            }
                        }
                    }
                }
            `;
            const variables = { contactId, supportedColumns };
            const response = await monday.api(query, { variables });
            const details = response.data.items[0];

            setContactDetails(details);
            setIsLoadingDetails(false);
        } catch (err) {
            setError(err);
            setIsLoadingDetails(false);
        }
    }

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

            // // unselect the deleted contact
            setSelectedContactId(null);

        } catch (error) {
            throw new Error(`Error deleting contact: ${error}`);            
        }
    };

    if (isLoadingDetails) {
        return (
            <div>Loading contact details... <Loader size={20} /></div>
        );
    }

    if (error) {
        return (
            <div>Error loading details: {error.message}</div>
        );
    }

    if(isEditing){
        return (
            <ContactEditor item={contactDetails} supportedColumnInfo={supportedColumnInfo} setContacts={setContacts} setIsEditing={setIsEditing} loadNewDetails={loadContactDetails}/>
        );
    }

    return (
        <div className="contact-details-container">
            <div>
                <h4>{contactDetails.name}</h4>
                <p> <strong>ID:</strong> {contactDetails.id}</p>
                {contactDetails.column_values.map((col) => (
                    <p key={col.id}>
                        <strong>{col.column.title}:</strong> {col.text}
                    </p>
                ))}
            </div>
            <div className="flexApart">
                <Button
                    onClick={() => {setIsEditing(true)}}
                    color="primary"
                    size="medium"
                    kind="primary"
                    disabled={false}
                >
                    Edit Contact
                </Button>
                <Button
                    onClick={() => handleDeleteContact(contactDetails)}
                    color="negative"
                    size="medium"
                    kind="primary"
                    disabled={false}
                >
                    Delete Contact
                </Button>
            </div>
        </div>
    );
}

export default ContactDetails;