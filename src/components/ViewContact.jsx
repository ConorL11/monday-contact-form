import { Button } from "monday-ui-react-core";
import ContactForm from "./ContactForm";
import { useMondayContext } from "./context";


// function for when an individual contact is selected from the side bar
function ViewContact({ contacts, selectedContact, onEdit, isEditing, cancelEdit, startEdit, onDelete, onUpdate }) {
    const { monday } = useMondayContext();

    async function deleteItem(itemId) {
        // delete item from API 
        try {
            let query = `
                mutation {
                    delete_item (item_id: ${itemId}) {
                        id
                    }
                }
            `;
            await monday.api(query);
            
            // Remove from local state
            onDelete(itemId); 
        } catch (error) {
            console.error(error);
        }
    }
    

    return (
        <div>
            {isEditing ?
                (
                    <div>
                        <ContactForm item={selectedContact} cancelEdit={cancelEdit} onUpdate={onUpdate}/>
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
                        <div className="flexApart">
                            <Button
                                onClick={startEdit}
                                color="primary"
                                size="medium"
                                kind="primary"
                                disabled={false}
                            >
                                Edit Contact
                            </Button>
                            <Button
                                onClick={() => {deleteItem(selectedContact.id)}}
                                color="negative"
                                size="medium"
                                kind="primary"
                                disabled={false}
                            >
                                Delete Contact
                            </Button>
                        </div>
                    </div>
                    
                )
            }

        </div>
    );
}

export default ViewContact;
