import "../App.css";
import { Heading } from "@vibe/core";

function ContactForm() {
    
    return(
        <div className="contact-form">
            <div className="contact-form-views">
                <div className="clickable-header">
                    <Heading type="h3">Add Contact</Heading>
                </div>
                <div className="clickable-header">
                    <Heading type="h3">View Contacts</Heading>
                </div>
            </div>
        </div>
    )
}

export default ContactForm