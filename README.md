Contact Management App for Monday.com
A simple React-based app designed to manage contact information within Monday.com, allowing users to create and update contact details directly from a Monday.com board. This app utilizes Monday.com’s API to interact with board data and dynamically generates forms based on the column configuration.

Features
Dynamic Forms: Automatically generates form fields based on Monday.com board column configuration, including support for text, email, and status columns.
Add New Contacts: Create new contact entries by filling out the form fields.
Update Existing Contacts: Edit contact information for existing items on the board.
Monday.com API Integration: Interacts with the Monday.com API to create and update items on a board.
Prerequisites
This app is built to be embedded within Monday.com.
You will need a Monday.com account and a board where you want to use this app.
You must set up the app in Monday.com using their developer environment.
Installation and Setup
To use this app, you'll need to build and upload it to Monday.com:

Clone the Repository:

bash
Copy
Edit
git clone https://github.com/yourusername/contact-management-app.git
Install Dependencies: Navigate into the project directory and install the dependencies:

bash
Copy
Edit
cd contact-management-app
npm install
Build the App: Run the build command to bundle the app:

bash
Copy
Edit
npm run build
Prepare for Upload: After the build completes, you'll have a build folder with all the necessary files.

Upload to Monday.com:

Log in to your Monday.com developer environment.
Go to the "Apps" section.
Create a new app or select an existing app.
Upload the contents of the build folder as a feature in your app.
Configure Your App:

Set up environment variables or configurations required for interacting with the Monday.com API, such as the board ID and authentication details.
Customize any settings in Monday.com for your app.
Start Using: Once uploaded and configured, you can start using the app within your Monday.com account.


Usage
Creating a New Contact: Fill in the fields (First Name, Last Name, Email, etc.) in the form and click "Add Contact" to create a new contact entry on your Monday.com board.

Updating an Existing Contact: If an item is passed as a prop (for example, when you’re editing an existing contact), the form will pre-populate with the existing information, allowing for easy updates.

Deleting a Contact: If you need to delete an existing contact, there’s an option to remove the item directly from your Monday.com board. Clicking the "Delete Contact" button will prompt the app to delete the corresponding item.
