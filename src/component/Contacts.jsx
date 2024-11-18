import { useEffect, useState } from "react";
import inputs from "../constants/input";
import { v4 } from "uuid";
import Contactlist from "./Contactlist";
import Search from "./Search";


function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [contact, setContact] = useState({
    name: "",
    lastName: "",
    phone: "",
    email: "",
    avatar: "",
  });
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [editId, setEditId] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [selectedContacts, setSelectedContacts] = useState([]);

  useEffect(() => {
    setFilteredUsers(contacts);
  }, [contacts]);

  const contactHandler = (event) => {
    const { name, value } = event.target;
    const updatedContact = { ...contact, [name]: value };
    setContact(updatedContact);
    validate(updatedContact); 
  };

  const avatarHandler = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setContact((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setContact((prev) => ({ ...prev, avatar: "" })); 
    }
  };

  const validate = (updatedContact) => {
    const newErrors = {};
    if (!updatedContact.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(updatedContact.name)) {
      newErrors.name = "Name can only contain letters.";
    } else if (
      updatedContact.name.length < 2 ||
      updatedContact.name.length > 10
    ) {
      newErrors.name = "Name must be between 2 and 10 characters.";
    }
    if (!updatedContact.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(updatedContact.lastName)) {
      newErrors.lastName = "Last name can only contain letters.";
    } else if (
      updatedContact.lastName.length < 2 ||
      updatedContact.lastName.length > 50
    ) {
      newErrors.lastName = "Last name must be between 2 and 50 characters.";
    }
    if (!updatedContact.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(updatedContact.email)) {
      newErrors.email = "Invalid email format.";
      console.log(newErrors.email);
    }
    if (!updatedContact.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d+$/.test(updatedContact.phone)) {
      newErrors.phone = "Phone must be numeric.";
    } else if (!/^\d{10}$/.test(updatedContact.phone)) {
      newErrors.phone = "Please provide valid phone number";
    }
    setErrors(newErrors);

    setIsFormValid(Object.keys(newErrors).length === 0);
    console.log(errors);
    return newErrors;
  };

  const addHandler = () => {
    const newContact = { ...contact, id: v4() };
    setContacts((contacts) => [...contacts, newContact]);
    setContact({
      name: "",
      lastName: "",
      phone: "",
      email: "",
      avatar: "",
    });
    setFileInputKey(Date.now());
    setSuccessMessage("Contact added successfully!");
    setTimeout(() => {
      setSuccessMessage("");
    }, 2000);
  };
  const saveHandler = () => {
    setHasSubmitted(true); 
    const validationErrors = validate(contact); 

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (editId) {
      
      setContacts((prevContacts) =>
        prevContacts.map((item) =>
          item.id === editId ? { ...contact, id: editId } : item
        )
      );

      setEditId(null); 
    } else {
      
      const newContact = { ...contact, id: v4() };
      setContacts((prevContacts) => [...prevContacts, newContact]);
    }
    resetForm();
  };

  const deleteSelectedContacts = ()=>{
    setContacts((prevContacts) =>
    prevContacts.filter((contact)=> !selectedContacts.includes(contact.id))
    )
    setSelectedContacts([])
  }
  

  const resetForm = () => {
    setContact({ name: "", lastName: "", phone: "", email: "", avatar: "" });
    setFileInputKey(Date.now());
    setErrors({});
    setHasSubmitted(false);
    setIsFormValid(false);
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchItem(term);
    filterContacts(term);
  };

  const filterContacts = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredUsers(contacts); 
      return;
    }
    const filteredItems = contacts.filter((con) =>
      [con.name, con.lastName, con.phone, con.email]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filteredItems);
  };

  const editHandler = (id) => {
    const contactToEdit = contacts.find((contact) => contact.id === id);
    if (contactToEdit) {
      setContact(contactToEdit);
      setEditId(id);
    }
  };

  const deleteHandler = (id) => {
    const newContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(newContacts);
    
  };
  useEffect(() => {
    filterContacts(searchItem);
  }, [contacts, searchItem]);

  return (
    <div className="flex justify-start">
      {successMessage && (
        <div
          role="alert"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white p-5 rounded-lg z-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {successMessage}
        </div>
      )}
      <div className=" flex justify-end box-border mt-2 translate-x-[150px]">
        <Contactlist
          selectedContacts={selectedContacts}
          setSelectedContacts={setSelectedContacts}
          deleteHandler={deleteHandler}
          editHandler={editHandler}
          filteredUsers={filteredUsers}
        />
        <div className="flex justify-between">
        <button  className=" box-border  btn border-white m-0 mt-10 p-0" disabled={selectedContacts.length === 0} onClick={deleteSelectedContacts}>
        Delete Selected
        </button>
        </div>
        <Search searchItem={searchItem} handleSearch={handleSearch} />
      </div>

      <div className="flex z-10 fixed justify-end translate-x-[800px] max-h-[600px] min-h-[550px]" >
        <div className=" mt-10 translate-x-[80px] text-white w-[550px] bg-[#121212] shadow-2xl rounded-lg p-5">
          <input
            key={fileInputKey}
            className="file-input  w-full max-w-xs m-3"
            onChange={avatarHandler}
            type="file"
            placeholder="Upload Avatar"
            name="avatar"
          />

          {inputs.map((input, index) => (
            <div key={index} className="m-3">
              <input
                className="input input-bordered flex items-center gap-2 m-3"
                type={input.type}
                placeholder={input.placeholder}
                name={input.name}
                value={contact[input.name]}
                onChange={contactHandler}
                minLength={input.minLength}
                maxLength={input.maxLength}
              />
              <div
                className="text-red-500 text-sm mt-1"
                style={{ minHeight: "1em" }} 
              >
                {errors[input.name]}
              </div>
            </div>
          ))}

          <button
            className={`btn w-full mt-2 flex  ${!isFormValid ? "btn-disabled" : "btn-secondary"}`}
            disabled={!isFormValid}
            onClick={editId ? saveHandler : addHandler}
          >
            {editId ? "Save Changes" : "Add Contact"}
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default Contacts;
