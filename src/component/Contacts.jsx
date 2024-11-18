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

  useEffect(() => {
    // برای نمایش تمام مخاطبین در ابتدا
    setFilteredUsers(contacts);
  }, [contacts]);

  const contactHandler = (event) => {
    const { name, value } = event.target;
    const updatedContact = { ...contact, [name]: value };
    setContact(updatedContact);
    validate(updatedContact); // اعتبارسنجی هنگام تغییر
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
      setContact((prev) => ({ ...prev, avatar: "" })); // حذف تصویر در صورت لغو انتخاب
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
    setHasSubmitted(true); // خطاها را نشان بده
    const validationErrors = validate(contact); // اعتبارسنجی و دریافت خطاها
    console.log("saveHandler ~ validationErrors", validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return; // اگر خطا وجود دارد، از ادامه جلوگیری کن
    }

    if (editId) {
      // به‌روزرسانی مخاطب موجود
      setContacts((prevContacts) =>
        prevContacts.map((item) =>
          item.id === editId ? { ...contact, id: editId } : item
        )
      );
      setEditId(null); // حالت ویرایش را غیرفعال می‌کنیم
    } else {
      // اضافه کردن مخاطب جدید
      const newContact = { ...contact, id: v4() };
      setContacts((prevContacts) => [...prevContacts, newContact]);
    }
    resetForm();
  };
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
      setFilteredUsers(contacts); // اگر جستجو خالی است، همه مخاطبین را نمایش دهید
      return;
    }
    const filteredItems = contacts.filter((con) =>
      [con.name, con.lastName, con.phone, con.email] // فقط این فیلدها جستجو شوند
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
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 text-white p-5 rounded-lg z-50">
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
      <div className=" flex justify-end box-border mt-2">
      <Contactlist
        deleteHandler={deleteHandler}
        editHandler={editHandler}
        filteredUsers={filteredUsers}
      />
      <Search searchItem={searchItem} handleSearch={handleSearch} />

      </div>

      <div className="flex">
        
        <div className=" mt-10 text-white w-[600px] bg-[#121212] shadow-2xl rounded-lg p-5">
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
                style={{ minHeight: "1em" }} // فضای ثابت برای جلوگیری از جابجایی
              >
                {errors[input.name]}
              </div>
            </div>
          ))}
          
         
          <div className=" box-border translate-x-[300px] translate-y-[-300px] font-sans flex flex-col bottom-[15rem] left-[21rem] font-light	max-w-64">
            <div>
              {contact.avatar && (
                <img
                  className="avatar  rounded-full  w-[90px] h-[90px]  "
                  src={contact.avatar}
                  alt="Preview"
                />
              )}
            </div>
            <div className="  flex  flex-row  mt-1 items-center p-2 ">
              {contact.phone && <p>{contact.phone}</p>}
            </div>
            <div className="  flex  flex-row   items-center ">
              {contact.name && (
                <>
                  <h1 className="p-2">{contact.name}</h1>
                  <h1 className="p-2">{contact.lastName}</h1>
                </>
              )}
            </div>
          </div>
               

          <button
            className={`btn w-full mt-2 ${!isFormValid ? "btn-disabled" : "btn-secondary"}`}
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
