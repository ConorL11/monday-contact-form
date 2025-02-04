// function ViewContact ({ selectedContact }) {

//     const [isEditing, setIsEditing] = useState(false);
//     const [editedContact, setEditedContact] = useState({ ...selectedContact });


//     return (
//         <div>
        //     <p><strong>Item ID:</strong> {selectedContact.id}</p>
        //     <p><strong>Name:</strong> {selectedContact.name}</p>
        //     <p><strong>First Name:</strong> {selectedContact.firstName}</p>
        //     <p><strong>Last Name:</strong> {selectedContact.lastName}</p>
        //     <p><strong>Status:</strong> {selectedContact.status}</p>
        // </div>
//     )
// }

// export default ViewContact

import { useEffect, useState } from "react";
import { Button } from "monday-ui-react-core";
import ContactForm from "./ContactForm";

function ViewContact({ selectedContact, onEdit, isEditing, resetEditing }) {
    const [editedContact, setEditedContact] = useState({ ...selectedContact });

    const handleChange = (e) => {
        setEditedContact({
            ...editedContact,
            [e.target.name]: e.target.value
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        onEdit(editedContact); 
        resetEditing(false); 
    };

    // Sync editedContact when selectedContact changes
    useEffect(() => {
        setEditedContact({ ...selectedContact });
    }, [selectedContact]);

    return (
        <div>
            {isEditing ? 
                (
                    <div>
                        <ContactForm itemId={selectedContact.id} onCancelEdit={resetEditing}/>
                    </div>
                ) : 
                (
                    <div>

                        <div>
                            <p><strong>Item ID:</strong> {selectedContact.id}</p>
                            <p><strong>Name:</strong> {selectedContact.name}</p>
                            <p><strong>First Name:</strong> {selectedContact.firstName}</p>
                            <p><strong>Last Name:</strong> {selectedContact.lastName}</p>
                            <p><strong>Status:</strong> {selectedContact.status}</p>
                        </div>
                        <Button
                            onClick={() => resetEditing()}
                            color="primary"
                            size="medium"
                            kind="primary"
                            disabled={false}
                        >
                            {isEditing ? "Cancel Edit" : "Edit Contact"}
                        </Button>
                    </div>
                    
                )
            }


            {/* <Button
                onClick={() => setIsEditing(!isEditing)}
                color="primary"
                size="medium"
                kind="primary"
                disabled={false}
            >
                {isEditing ? "Cancel Edit" : "Edit Contact"}
            </Button>

            <Button
                onClick={() => onDelete(selectedContact.id)}
                color="negative"
                size="medium"
                kind="secondary"
                disabled={false}
            >
                Delete Contact
            </Button> */}

        </div>
    );
}

export default ViewContact;
