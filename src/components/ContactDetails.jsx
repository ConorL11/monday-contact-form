import { useState, useEffect, useCallback } from "react";
import { Button, Loader } from "@vibe/core";
import { useMondayContext } from "./context";
import ContactForm from "./ContactForm";
import { supportedColumns } from "./constants";
import ContactEditor from "./ContactEditor";

function ContactDetails({ contactId, deleteContact, onUpdate }) {
    
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
        loadContactDetails();
    }, [contactId, monday]);

    const handleCancelEdit = useCallback(() => {
        setIsEditing(false);
    }, []);

    const handleUpdate = useCallback((updatedContact) => {
        setContactDetails((prevDetails) => ({
            ...prevDetails,
            name: updatedContact.name || prevDetails.name,
            column_values: prevDetails.column_values.map(col => ({
                ...col,
                text: updatedContact[col.id] || col.text, // Ensure updated values are applied
            }))
        }));
        setIsEditing(false);
        if (onUpdate) {
            onUpdate(updatedContact);
        }
    }, [onUpdate]);

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
            // <ContactForm
            //     item={contactDetails}
            //     cancelEdit={handleCancelEdit}
            //     onUpdate={handleUpdate}
            // />
            <ContactEditor 
                item={contactDetails}
                cancelEdit={handleCancelEdit}
                onSave={handleUpdate}
            />
        );
    }

    return (
        <div>
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
                    onClick={() => deleteContact(contactDetails)}
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