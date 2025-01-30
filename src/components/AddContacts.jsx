import { Button } from "monday-ui-react-core";
import { useState } from "react";
import "../App.css";

function AddContacts() {

    const [formEntryData, setFormEntryData] = useState({ firstName: "", lastName: "", email: "", phoneNumber: "", address: "", birthday: "", notes: "", tags:"" });
    
    const handleChange = (e) => {
        setFormEntryData({ ...formEntryData, [e.target.name]: e.target.value });
    };

    return(
        <div>
            I'm the Add Contacts Screen
        </div>
    )

//     <form>
//     <div>
//         <label>Name</label>
//         {/* can use required as an option */}
//         <input
//             type="text"
//             name="name"
//             value={formEntryData.name}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//         />
//     </div>
//     <div>
//         <Button>Click Me</Button>
//     </div>
// </form> 
}

export default AddContacts