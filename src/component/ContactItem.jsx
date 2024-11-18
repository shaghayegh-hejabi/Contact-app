function ContactItem({
  data: { id, name, lastName, email, phone, avatar },
  editHandler,
  deleteHandler,
}) {
  return (
    <li
      key={id}
      className="  text-base flex justify-around m-4  p-2 border-b-2 border-gray-600 w-[430px] "
    >
      <div className="flex items-center">
        {avatar && (
          <img
            src={avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover mr-2"
          />
        )}
        <p>
          {name} {lastName}
        </p>
      </div>
      <div>
        <p className="flex flex-col p-1">{phone}</p>
        <p>{email}</p>
      </div>
      <div className="dropdown dropdown-end fixed flex translate-x-[165px]">
        <div tabIndex={0} role="button" className="m-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            ></path>
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu backdrop-blur-md rounded-box z-[1] w-52 p-2 shadow"
        >
          <li>
            <a onClick={() => editHandler(id)}>Edit</a>
          </li>
          <li>
            <a onClick={() => deleteHandler(id)}>delete</a>
          </li>
        </ul>
      </div>
    </li>
  );
}

export default ContactItem;
