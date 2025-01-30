import "../App.css";
import { useState } from "react";
import { Button } from "monday-ui-react-core";
// import { Button } from "@vibe/core";
import { Heading } from "@vibe/core";
import ViewContacts from "./ViewContacts";
import AddContacts from "./AddContacts";

function ContactForm() {
    
    const [selectedView, setSelectedView] = useState('viewContacts')
    const handleViewChange = (option) => {
        setSelectedView(option)
    }

    return(
        <div className="contact-form">
            <div className="contact-form-views">
                <div  className="clickable-header add-contact-selector">
                    <Button kind="tertiary" className={`headerButton ${selectedView === 'addContacts' ? 'selected' : ''}`} onClick={() => {handleViewChange('addContacts')}}>
                        <Heading type="h3" align="center">Add Contact</Heading>
                    </Button>
                </div>
                <div className="clickable-header view-contact-selector">
                    <Button kind="tertiary" className={`headerButton ${selectedView === 'viewContacts' ? 'selected' : ''}`} onClick={() => {handleViewChange('viewContacts')}}>
                        <Heading type="h3" align="center">View Contact Contact</Heading>
                    </Button>
                </div>
            </div>
            {selectedView === 'addContacts' && <AddContacts />}
            {selectedView === 'viewContacts' && <ViewContacts />}
        </div>
    )
}

export default ContactForm