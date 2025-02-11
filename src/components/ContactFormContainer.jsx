import "../App.css";
import { useState } from "react";
import { Button } from "monday-ui-react-core";
import { Heading } from "@vibe/core";
import ViewContacts from "./ViewContacts";
import ContactForm from "./ContactForm";


// highest level function used to allow the user to select between adding a contact or editing existing contacts. 
// placing this in its own file to allow for more maintenance moving forward in case of a rewrite or large scale changes
function ContactFormContainer() {
    
    // states for handling which tab is selected
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