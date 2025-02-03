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
    const handleSubmit = useCallback(async() => {
        addGroup();
        setSuccess(true);
        setSuccessText('Contact Added');
    }, [setSuccess])


    async function addGroup() {
        try {
            // const boardId = (await monday.get('context')).data.boardId;
            // let query = `query getNames ($boardId:[ID!]){
            //     boards(ids: $boardId){
            //         items_page{
            //         items {
            //             id,
            //             column_values(ids:["text_mkmmh4rt","text_mkmmhp5z"]){
            //             id,
            //             text
            //             }
            //         }
            //         }
            //     }
            // }`
            // const variables =  { boardId };
            // const response = await monday.api(query, { variables });
            // console.log(response.data.boards)
            // return response.data.boards
            console.log("addGroup Function");
            return true
        } catch (error) {
            console.log(error);
        }
    }


    return(
        <div>
            <form className="add-contact-view" onSubmit={handleSubmit}>
                <div className="add-contact-inputs">
                    <TextField
                        placeholder=""
                        title="First Name"
                    />
                    <TextField
                        placeholder=""
                        title="Last Name"
                    />
                    <TextField
                        placeholder=""
                        title="Email"
                    />
                </div>
                <div>
                    <Button
                        onClick={() => {handleSubmit()}}
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