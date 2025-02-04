import "../App.css";
import { useState } from "react";
import { Button } from "monday-ui-react-core";
import { Heading } from "@vibe/core";
import ViewContacts from "./ViewContacts";
import ContactForm from "./ContactForm";

function ContactFormContainer() {
    
    const [selectedView, setSelectedView] = useState('viewContacts')
    const handleViewChange = (option) => {
        setSelectedView(option)
    }

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
            {selectedView === 'addContact' && <ContactForm />}
            {selectedView === 'viewContacts' && <ViewContacts />}
        </div>
    )
}

export default ContactFormContainer