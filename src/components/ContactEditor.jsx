import { Button, Dropdown } from "monday-ui-react-core";
import { Check } from "monday-ui-react-core/icons";
import { useCallback, useState, useEffect } from "react";
import { TextField } from "@vibe/core";
import "../App.css";
import { useMondayContext } from "./context";
import { itemNameOnCreate } from "./constants";


function ContactEditor({item, supportedColumnInfo, setContacts, setIsEditing, loadNewDetails }) {

    // retrieve context
    const { monday, mondayContext } = useMondayContext();

    // Create a lookup table for the column values using map
    const columnValuesLookup = {};
    item?.column_values.map((columnValue) => {
        columnValuesLookup[columnValue.id] = columnValue.text;
    });

    // Initialize form data using the lookup table
    const initialFormData = {};
    initialFormData['name'] = item?.name;
    supportedColumnInfo.map((col) => {
        const value = columnValuesLookup[col.id] || "";
        initialFormData[col.id] = value;
    });

    // define state for form data using initial form data which is either blank or pulls from the item passed in as a prop
    const [formData, setFormData] = useState(initialFormData);

    // state for success handling
    const [successText, setSuccessText] = useState(null);
    const [success, setSuccess] = useState(null);

    // handle user entry into the form and update the state of the formData
    const handleChange = (fieldId) => (value) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldId]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(!item){
            createItem();
        }

        if(item){
            updateItem(item);
        }
    }

    // pass form values to selected item for item update
    async function updateItem(item) {
        try {
            const boardId = mondayContext.boardId;
            const itemId = item.id;

            // Dynamically build columnValues based on supportedColumnInfo
            const columnValues = {};
            supportedColumnInfo.forEach((column) => {
                const value = formData[column.id];
                switch (column.type) {
                    case "email":
                        // For email columns, structure the value as an object
                        columnValues[column.id] = {
                            email: value,
                            text: value,
                        };
                        break;
                    case "status":
                        // For status columns, use the selected value directly
                        columnValues[column.id] = value;
                        break;
                    default:
                        // Default to text handling
                        columnValues[column.id] = value;
                    break;
                }
            });
            // hardcode name into my updated values
            columnValues['name'] = formData.name;


            // Stringify the column values for the API
            const columnValuesJSON = JSON.stringify(columnValues);
            let query = `
                mutation changeItemColumnValues($itemId:ID, $boardId:ID!, $columnValuesJSON:JSON!) {
                    change_multiple_column_values(item_id:$itemId, board_id:$boardId, column_values:$columnValuesJSON) {
                        id, 
                        name
                    }
                }
            `;

            const variables = { boardId, itemId, columnValuesJSON};
            const response = await monday.api(query, { variables });
    
            // Get my ID and name back from API call
            const updatedContact = { 
                id: response.data.change_multiple_column_values.id, 
                name: response.data.change_multiple_column_values.name 
            };

            // Update local state for contacts list
            setContacts((prevContacts) => {
                return prevContacts.map(contact =>
                    contact.id === updatedContact.id ? updatedContact : contact
                );
            });

            setSuccess(true);
            setSuccessText("Contact Updated!"); 

            loadNewDetails(); // reload contact details with new info
            setIsEditing(false); // exit editing form

    
        } catch (error) {
            console.error(error);
        }
    }

    // function for item create. pass form values to board as a new item
    async function createItem() {
        try {
            const boardId = mondayContext.boardId;
            const itemName = itemNameOnCreate.map(id => formData[id] || "").join(" ");

            // Dynamically build columnValues based on supportedColumnInfo
            const columnValues = {};
            supportedColumnInfo.forEach((column) => {
                const value = formData[column.id];
                switch (column.type) {
                    case "email":
                        // For email columns, structure the value as an object
                        columnValues[column.id] = {
                            email: value,
                            text: value,
                        };
                        break;
                    case "status":
                        // For status columns, use the selected value directly
                        columnValues[column.id] = value;
                        break;
                    default:
                        // Default to text handling
                        columnValues[column.id] = value;
                    break;
                }
            });

            console.log(columnValues)

            // Stringify the column values for the API
            const columnValuesJSON = JSON.stringify(columnValues);

            let query = `
                mutation createItemColumns ($boardId:ID! $itemName:String!, $columnValuesJSON:JSON){
                    create_item (board_id: $boardId, item_name: $itemName, column_values: $columnValuesJSON) {
                        id
                    }
                }
            `;
            const variables = {boardId, itemName, columnValuesJSON}
            const response = await monday.api(query, { variables });


            // After creating the item, update the contacts state
            const newContact = { id: response.data.create_item.id, name: itemName };
            setContacts(prevContacts => [...prevContacts, newContact]);
            setSuccess(true);
            setSuccessText("Contact Added!");
        } catch (error) {
            console.error(error);
        }
    }

    //function to reset form to original data
    const resetForm = () => {
        setFormData(initialFormData); 
        setSuccess(null); 
        setSuccessText(null);
    }

    const handleCancelEdit = () => {
        setIsEditing(false);
    }

    return (
        <div className="contact-form-container">
            <form className="add-contact-view" onSubmit={handleSubmit}> 
            <div className="add-contact-inputs">
                {item && <TextField title="Name" value={formData.name} onChange={handleChange("name")} /> }
                {supportedColumnInfo.map((column) => {
                    // Render a text input if the column type is text or email
                    if (column.type === "text" || column.type === "email") {
                        return (
                            <TextField
                                key={column.id}
                                title={column.title}
                                value={formData[column.id]}
                                onChange={handleChange(column.id)}
                            />
                        );
                    }
                    // Render a dropdown if the column type is status
                    if (column.type === "status") {
                        return (
                            <div key={column.id}>
                                <div className="formInputHeader">{column.title}</div>
                                <Dropdown
                                    options={column.formattedStatusValues || []} 
                                    title={column.title}
                                    value={formData[column.id]}
                                    onChange={handleChange(column.id)}
                                />
                            </div>
                        );
                    }
                })}
            </div>
                {item ? 
                    ( 
                        <div className="flexApart">
                            <Button
                                type="submit"
                                size={Button.sizes.MEDIUM}
                                success={success}
                                successIcon={Check}
                                successText={successText}
                            >
                                Update Contact
                            </Button>
                            <Button
                                color="negative"
                                size="medium"
                                kind="primary"
                                onClick={handleCancelEdit}
                            >
                                Cancel Update
                            </Button>
                        </div>
                    ) : 
                    (
                        <div className="flexApart">
                            <Button
                                type="submit"
                                size={Button.sizes.MEDIUM}
                                success={success}
                                successIcon={Check}
                                successText={successText}
                            >
                                Add Contact
                            </Button>
                            {success && 
                                <Button
                                    kind="primary"
                                    size={Button.sizes.MEDIUM}
                                    onClick={resetForm}
                                >
                                    Reset Form
                                </Button>
                            }
                        </div>
                    )
                }
            </form>
        </div>
    );
}

export default ContactEditor