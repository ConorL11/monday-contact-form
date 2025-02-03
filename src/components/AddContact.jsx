import { Button } from "monday-ui-react-core";
import { Check } from "monday-ui-react-core/icons";
import { useCallback, useState } from "react";
import { TextField } from "@vibe/core";
import "../App.css";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

function AddContact() {

    // success handling for form submittal
    const [successText, setSuccessText] = useState(null);
    const [success, setSuccess] = useState(false);

    // State for form inputs
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: ""
    });


    // Handle input change
    const handleChange = (field) => (value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Submit handler
    const handleSubmit = useCallback(async (event) => {
        if (event) event.preventDefault(); // Prevent default only if event exists
        await createItem(formData);
        setSuccess(true);
        setSuccessText("Contact Added");
    }, [formData]);

    

    async function createItem() {
        try {
            const boardId = (await monday.get("context")).data.boardId;
            // const columnValues = JSON.stringify({ text_mkmmh4rt: `${formData.firstName}` }).replace(/"/g, '\\"');
            const columnValues = JSON.stringify({ 
                text_mkmmh4rt: formData.firstName, 
                text_mkmmhp5z: formData.lastName, 
                email_mkmmyw8x: { 
                    email: formData.email, 
                    text: formData.email // You can customize this display text
                }
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
                </div>
                <div>
                    <Button
                        type="submit"
                        size={Button.sizes.MEDIUM}
                        success={success}
                        successIcon={Check}
                        successText={successText}
                    >
                        Button
                    </Button>
                </div>
            </form> 
        </div>
    )
}

export default AddContact