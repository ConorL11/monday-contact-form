import { Button, Dropdown } from "monday-ui-react-core";
import { Check } from "monday-ui-react-core/icons";
import { useCallback, useState, useEffect } from "react";
import { TextField } from "@vibe/core";
import "../App.css";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

function AddContact() {

    // state var for status labels
    const [statusValues, setStatusValues] = useState();

    useEffect(() => {
        if(!statusValues){
            getStatusValues();
        }
    }, [statusValues])
    

    // get status values for form
    async function getStatusValues() {
        try {
            const boardId = (await monday.get("context")).data.boardId;
            const variables = { boardId }

            let query = `
                query getStatuses ($boardId:[ID!]){
                    boards(ids: $boardId){
                    columns (ids: ["status"]){
                        id,
                        title,
                        type, 
                        settings_str
                    }
                    }
                }
            `;
    
            // get response and accept settings string into a const 
            const response = await monday.api(query, { variables });
            const settingsStringRaw = response.data.boards[0].columns[0].settings_str;
            const settingsString = JSON.parse(settingsStringRaw);
            const statusValuesRaw = Object.values(settingsString.labels);

            // format status Values to fit in Dropdown component
            const statusValues = [];
            for(const val of statusValuesRaw){
                statusValues.push({
                    value: val,
                    label: val
                });
            };

            //set state for dropdown and return dropdown formatted options
            setStatusValues(statusValues)
            return statusValues;
        } catch (error) {
            console.log(error);
        }
    }


    // success handling for form submittal
    const [successText, setSuccessText] = useState(null);
    const [success, setSuccess] = useState(null);

    // State for form inputs
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "", 
        status: "",
    });


    // Handle input change
    const handleChange = (field) => (value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Submit handler
    const handleSubmit = useCallback(async (event) => {
        if (event) event.preventDefault();
        console.log("formData")
        console.log(formData)
        await createItem(formData);
        setSuccess(true);
        setSuccessText("Contact Added");
    }, [formData]);
    

    // Reset form handler
    const resetForm = () => {
        setFormData({
            firstName: "",
            lastName: "",
            email: "", 
            status: ""
        });
        setSuccess(null);
        setSuccessText(null);
    };

    async function createItem() {
        try {
            const boardId = (await monday.get("context")).data.boardId;
            const columnValues = JSON.stringify({ 
                text_mkmmh4rt: formData.firstName, 
                text_mkmmhp5z: formData.lastName, 
                email_mkmmyw8x: { 
                    email: formData.email, 
                    text: formData.email
                },
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
        
            const response = await monday.api(query);
            console.log(response);
    
            return response;
        } catch (error) {
            console.log(error);
        }
    }
    

    return(
        <div>
            <form className="add-contact-view" onSubmit={(event) => handleSubmit(event)}>
                <div className="add-contact-inputs">
                    <TextField
                        placeholder=""
                        title="First Name"
                        value={formData.firstName}
                        onChange={handleChange("firstName")}
                    />
                    <TextField
                        placeholder=""
                        title="Last Name"
                        value={formData.lastName}
                        onChange={handleChange("lastName")}
                    />
                    <TextField
                        placeholder=""
                        title="Email"
                        value={formData.email}
                        onChange={handleChange("email")}
                    />
                    <div className="formInputHeader">Status</div>
                    <Dropdown
                        options={statusValues}
                        title="Status"
                        value={formData.status}
                        onChange={handleChange("status")}
                    />
                </div>
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
                            onClick={resetForm} 
                            size={Button.sizes.MEDIUM}
                        >
                            Reset Form
                        </Button>
                    }
                </div>
            </form>
        </div>
    )
}

export default AddContact