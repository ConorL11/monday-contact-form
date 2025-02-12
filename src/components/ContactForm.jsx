import { Button, Dropdown } from "monday-ui-react-core";
import { Check } from "monday-ui-react-core/icons";
import { useCallback, useState, useEffect } from "react";
import { TextField } from "@vibe/core";
import "../App.css";
import { useMondayContext } from "./context";


// Define Function for adding or updating contact form
// PROPS: 
// Item - pass in item to update. Add new item if null
// onSuccess - function for handling succesful update or add
// cancelEdit - function for handling exiting out of the update form
// onUpdate - state that 
function ContactForm({ item, onSuccess, cancelEdit, onUpdate}) {

    // retrieve context
    const { monday, mondayContext } = useMondayContext();


    // form value handling
    const [statusValues, setStatusValues] = useState();
    const [formData, setFormData] = useState({
        name: "",
        firstName: "",
        lastName: "",
        email: "",
        status: "",
    });


    // success handlers
    const [successText, setSuccessText] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (!statusValues) {
            getStatusValues();
        }
        if (item) {
            fetchItemData(item);
        }
    }, [statusValues, item]);


    // Retrieves status values from predefined "status" column and returns it in Dropdown friendly format
    async function getStatusValues() {
        try {
            const boardId = mondayContext.boardId;
            const variables = { boardId };
            let query = `
                query getStatuses ($boardId:[ID!]){
                    boards(ids: $boardId){
                        columns (ids: ["status"]){
                            settings_str
                        }
                    }
                }
            `;
            const response = await monday.api(query, { variables });
            const settingsStringRaw = response.data.boards[0].columns[0].settings_str;
            const settingsString = JSON.parse(settingsStringRaw);
            const statusValuesRaw = Object.values(settingsString.labels);
            const formattedStatusValues = statusValuesRaw.map(val => ({ value: val, label: val }));
            setStatusValues(formattedStatusValues);
        } catch (error) {
            console.error(error);
        }
    }



    // grabs item data from api to populate into form
    async function fetchItemData(selectedItem) {
        try {
            const itemId = selectedItem.id;
            let query = `
                query {
                    items (ids: [${itemId}]) {
                        name
                        column_values {
                            id
                            text
                        }
                    }
                }
            `;
            const response = await monday.api(query);
            const item = response.data.items[0];
            setFormData({
                name: item.name || "",
                firstName: item.column_values.find(col => col.id === "text_mkmmh4rt").text || "",
                lastName: item.column_values.find(col => col.id === "text_mkmmhp5z").text || "",
                email: item.column_values.find(col => col.id === "email_mkmmyw8x").text || "",
                status: statusValues?.find(s => s.label === item.column_values.find(col => col.id === "status").text) || ""
            });
        } catch (error) {
            console.error(error);
        }
    }

    // handle the change to form fields
    const handleChange = (field) => (value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };


    // handle form submittal for new items or updates
    const handleSubmit = useCallback(async (event) => {
        if (event) event.preventDefault();
        if (item) { // update contact
            await updateItem(item);
            setSuccessText("Contact Updated");
        } else { // add contact
            await createItem();
            setSuccessText("Contact Added");
        } 

        // update state for successful add or update
        setSuccess(true);
        if (onSuccess) onSuccess();
    }, [formData, item]);


    // function for item create. pass form values to board as a new item
    async function createItem() {
        try {
            const boardId = mondayContext.boardId;
            const columnValues = JSON.stringify({ 
                text_mkmmh4rt: formData.firstName, 
                text_mkmmhp5z: formData.lastName, 
                email_mkmmyw8x: { email: formData.email, text: formData.email },
                status: formData.status.label
            }).replace(/"/g, '\\"');

            let query = `
                mutation {
                    create_item(
                        board_id: ${boardId}, 
                        item_name: "${formData.firstName} ${formData.lastName}", 
                        column_values: "${columnValues}"
                    ) {
                        id
                    }
                }
            `;
            await monday.api(query);
        } catch (error) {
            console.error(error);
        }
    }

    // pass form values to selected item for item update
    async function updateItem(item) {
        try {
            const boardId = mondayContext.boardId;
            const itemId = item.id;
            const variables = { boardId, itemId };
            const columnValues = JSON.stringify({
                name: formData.name,
                text_mkmmh4rt: formData.firstName,
                text_mkmmhp5z: formData.lastName,
                email_mkmmyw8x: { email: formData.email, text: formData.email },
                status: formData.status.label
            }).replace(/"/g, '\\"');
            let query = `
                mutation changeItemColumnValues($itemId:ID, $boardId:ID!) {
                    change_multiple_column_values(item_id:$itemId, board_id:$boardId, column_values: "${columnValues}") {
                        id
                    }
                }
            `;
            await monday.api(query, { variables });
    
            // Update Item in local state
            const updatedContact = {
                id: item.id,
                name: formData.name,
                firstName: formData.firstName,
                lastName: formData.lastName,
                status: formData.status.label
            };
            onUpdate(updatedContact);
    
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <div className="contact-form-container">
            <form className="add-contact-view" onSubmit={handleSubmit}>
                <div className="add-contact-inputs">
                    {item && 
                        <TextField title="Name" value={formData.name} onChange={handleChange("name")} />
                    }
                    <TextField title="First Name" value={formData.firstName} onChange={handleChange("firstName")} />
                    <TextField title="Last Name" value={formData.lastName} onChange={handleChange("lastName")} />
                    <TextField title="Email" value={formData.email} onChange={handleChange("email")} />
                    <div className="formInputHeader">Status</div>
                    <Dropdown options={statusValues} title="Status" value={formData.status} onChange={handleChange("status")} />
                </div>
                <div className="flexApart">
                    <Button type="submit" size={Button.sizes.MEDIUM} success={success} successIcon={Check} successText={successText}>
                        {item ? "Update Contact" : "Add Contact"}
                    </Button>
                    {item && (
                        <Button size={Button.sizes.MEDIUM} color="negative" onClick={cancelEdit}>
                            Cancel Update
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default ContactForm;
