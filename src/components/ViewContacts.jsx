import { useEffect, useState } from "react";
import "../App.css";
import mondaySdk from "monday-sdk-js";

function ViewContacts() {
    const monday = mondaySdk();
    const [loaded, setLoaded] = useState(null);

    // Load in form and relevant data
    useEffect(() => {
        getNames();
    }, []);

    // Test API Function to add a group
    async function getNames() {
        try {
            const context = (await monday.get('context'));
            const boardId = context.data.boardId;
            console.log(boardId)
            let query = `query getNames2 {
                boards(ids: ["8337996619"]){
                    items_page{
                        items {
                            id,
                            column_values(ids:["text_mkmmh4rt","text_mkmmhp5z"]){
                            id,
                            text
                            }
                        }
                    }
                }
            }`
            const variables =  { boardId };
            const response = await monday.api(query, { variables });
            console.log(response.data.boards)
            return response.data.boards
        } catch (error) {
            setLoaded(false);
            console.log(error);
        }
    }

    if(loaded === false){
        return (
            <div>A loading error occurred</div>
        )
    } else {
        return (
            <div>
                I'm the View Contacts Screen
            </div>
        )
    }
}

export default ViewContacts