import { Button, Dropdown } from "monday-ui-react-core";
import { Check } from "monday-ui-react-core/icons";
import { useCallback, useState, useEffect } from "react";
import { TextField } from "@vibe/core";
import "../App.css";
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();

function ContactForm({ itemId = null, onSuccess, cancelEdit}) {
    const [statusValues, setStatusValues] = useState();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        status: "",
    });

    const [successText, setSuccessText] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (!statusValues) {
            getStatusValues();
        }
        if (itemId) {
            fetchItemData(itemId);
        }
    }, [statusValues, itemId]);

    async function getStatusValues() {
        try {
            const boardId = (await monday.get("context")).data.boardId;
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

    async function fetchItemData(itemId) {
        try {
            const boardId = (await monday.get("context")).data.boardId;
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
                firstName: item.column_values.find(col => col.id === "text_mkmmh4rt").text || "",
                lastName: item.column_values.find(col => col.id === "text_mkmmhp5z").text || "",
                email: item.column_values.find(col => col.id === "email_mkmmyw8x").text || "",
                status: statusValues?.find(s => s.label === item.column_values.find(col => col.id === "status").text) || ""
            });
        } catch (error) {
            console.error(error);
        }
    }

    const handleChange = (field) => (value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = useCallback(async (event) => {
        if (event) event.preventDefault();
        if (itemId) {
            await updateItem(itemId);
            setSuccessText("Contact Updated");
        } else {
            await createItem();
            setSuccessText("Contact Added");
        }
        setSuccess(true);
        if (onSuccess) onSuccess();
    }, [formData, itemId]);

    async function createItem() {
        try {
            const boardId = (await monday.get("context")).data.boardId;
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

    async function updateItem(itemId) {
        try {
            const boardId = (await monday.get("context")).data.boardId;
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
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <form className="add-contact-view" onSubmit={handleSubmit}>
                <div className="add-contact-inputs">
                    {itemId && <TextField title="Name" value={formData.firstName} onChange={handleChange("name")} />}
                    <TextField title="First Name" value={formData.firstName} onChange={handleChange("firstName")} />
                    <TextField title="Last Name" value={formData.lastName} onChange={handleChange("lastName")} />
                    <TextField title="Email" value={formData.email} onChange={handleChange("email")} />
                    <div className="formInputHeader">Status</div>
                    <Dropdown options={statusValues} title="Status" value={formData.status} onChange={handleChange("status")} />
                </div>
                <div className="flexApart">
                    <Button type="submit" size={Button.sizes.MEDIUM} success={success} successIcon={Check} successText={successText}>
                        {itemId ? "Update Contact" : "Add Contact"}
                    </Button>
                    {itemId && (
                        <Button
                            size={Button.sizes.MEDIUM} 
                            color="negative"
                            onClick={cancelEdit}
                        >
                            Cancel Update
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}

export default ContactForm;
