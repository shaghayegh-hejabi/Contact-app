import ContactItem from "./ContactItem"


function Contactlist({filteredUsers, deleteHandler , editHandler}) {
  return (
    <div className="w-[609px] translate-x-[231px] translate-y-[100px] font-sans text-white min-h-32 bg-black box-border">
        <h3 className="text-xl font-medium">Contacts</h3>
        <ul className=" text-base">
        {filteredUsers.length  > 0 ? (
          filteredUsers.map((contact) => (
            <ContactItem
              key={contact.id}
              data={contact}
              deleteHandler={deleteHandler}
              editHandler={editHandler}
            />
          ))
        ) : (
          <p>No contacts found</p>
        )}
            
        </ul>
    </div>
  )
}

export default Contactlist