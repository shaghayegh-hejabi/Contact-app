import ContactItem from "./ContactItem";

function Contactlist({
  filteredUsers,
  deleteHandler,
  editHandler,
  selectedContacts,
  setSelectedContacts,
}) {
  const handleSelect = (id) => {
    setSelectedContacts((prev) =>
      prev.includes(id)
        ? prev.filter((contactId) => contactId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className=" translate-x-[231px] translate-y-[100px] font-sans text-white min-h-32 w-[444px] bg-black box-border">
      <h3 className="text-xl font-medium">Contacts</h3>
      <ul className=" text-base">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((contact) => (
            <li key={contact.id} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedContacts.includes(contact.id)}
                className="checkbox checkbox-lg"
                onChange={() => handleSelect(contact.id)}
              />
              <ContactItem
                key={contact.id}
                data={contact}
                deleteHandler={deleteHandler}
                editHandler={editHandler}
              />
            </li>
          ))
        ) : (
          <p>No contacts found</p>
        )}
      </ul>
    </div>
  );
}

export default Contactlist;
