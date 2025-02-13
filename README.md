# Monday.com Contact Management App

This is a simple app that integrates with Monday.com to manage contacts. It allows you to create, update, and delete contacts directly from a Monday.com board.

## Features

- **Create a new contact**: Add contacts by filling in the required fields (First Name, Last Name, Email, etc.).
- **Update an existing contact**: Pre-populate the form with the current contact details, allowing for easy updates.
- **Delete a contact**: Delete a contact directly from the board.

## Usage

1. **Creating a New Contact**:  
   - Fill in the fields (First Name, Last Name, Email, etc.) in the form and click the "Add Contact" button to create a new contact entry on your Monday.com board.

2. **Updating an Existing Contact**:  
   - If an item is passed as a prop (for example, when you’re editing an existing contact), the form will pre-populate with the existing information, allowing for easy updates.

3. **Deleting a Contact**:  
   - To delete an existing contact, you can use the "Delete Contact" button. This will trigger an API call to remove the corresponding item from your Monday.com board.

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/your-username/monday-contact-management.git
