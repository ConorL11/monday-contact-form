import "../App.css";
import { useState, useEffect } from "react";
import { Button } from "monday-ui-react-core";
import { Heading } from "@vibe/core";
import ViewContacts from "./ViewContacts";
import { useMondayContext } from "../utils/context";
import { supportedColumns } from "../utils/constants";
import ContactEditor from "./ContactEditor";


// highest level function used to allow the user to select between adding a contact or editing existing contacts. 
// placing this in its own file to allow for more maintenance moving forward in case of a rewrite or large scale changes
function ContactFormContainer() {
    
    // states for handling which tab is selected
    const [selectedView, setSelectedView] = useState('viewContacts')
    const handleViewChange = (option) => {
        setSelectedView(option)
    }

    // state needed to retrieve items and column info from board and store them locally
    const [contacts, setContacts] = useState([]);
    const [supportedColumnInfo, setSupportedColumnInfo] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // retrieve monday context
    const { monday, mondayContext } = useMondayContext();

    // Pull contacts and supported column info
    useEffect(() => {
        async function loadContacts() {
            try {
                const boardId = mondayContext.boardId;
                const query = `
                    query getNames ($boardId:[ID!]) {
                        boards(ids: $boardId){
                            items_page(limit:500){
                                items {
                                    id,
                                    name
                                }
                            }
                        }
                    }
                `;
                const variables = { boardId };
                const response = await monday.api(query, { variables });
                const contactsRaw = response.data.boards[0].items_page.items;

                const formattedContacts = contactsRaw.map((contact) => ({
                    id: contact.id,
                    name: contact.name,
                }));

                setContacts(formattedContacts);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        }

        async function loadSupportedColumnInfo(supportedColumns) {
            try {
                const boardId = mondayContext.boardId;
                const query = `
                    query getColumnInfo ($boardId:[ID!], $supportedColumns:[String!]){
                        boards(ids: $boardId){
                            columns (ids: $supportedColumns ){
                                id,
                                title, 
                                type, 
                                settings_str
                            }
                        }
                    }
                `;
                const variables = { boardId, supportedColumns };
                const response = await monday.api(query, { variables });
                const rawColumnInfo = response.data.boards[0].columns;

                // format status info for Vibe Dropdown Components 
                rawColumnInfo.map(col => {
                    if(col.type === "status"){
                        const settingsString = JSON.parse(col.settings_str);
                        const statusValuesRaw = Object.values(settingsString.labels);
                        const formattedStatusValues = statusValuesRaw.map(val => ({ value: val, label: val }));
                        col.formattedStatusValues = formattedStatusValues
                    }
                });
                setSupportedColumnInfo(rawColumnInfo);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        }

        loadContacts();
        loadSupportedColumnInfo(supportedColumns)
        setIsLoading(false);
    }, [monday, mondayContext]);


    return(
        <div className="contact-form">
            <div className="contact-form-views">
                <div  className="clickable-header add-contact-selector">
                    <Button kind="tertiary" className={`headerButton ${selectedView === 'addContact' ? 'selected' : ''}`} onClick={() => {handleViewChange('addContact')}}>
                        <Heading type="h3" align="center">Add Contact</Heading>
                    </Button>
                </div>
                <div className="clickable-header view-contact-selector">
                    <Button kind="tertiary" className={`headerButton ${selectedView === 'viewContacts' ? 'selected' : ''}`} onClick={() => {handleViewChange('viewContacts')}}>
                        <Heading type="h3" align="center">View Contact</Heading>
                    </Button>
                </div>
            </div>
            {selectedView === 'addContact' && <ContactEditor supportedColumnInfo={supportedColumnInfo} setContacts={setContacts} />}
            {selectedView === 'viewContacts' && <ViewContacts contacts={contacts} setContacts={setContacts}  isLoading={isLoading} error={error} supportedColumnInfo={supportedColumnInfo}/>}
        </div>
    )
}

export default ContactFormContainer