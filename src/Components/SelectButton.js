const SelectButton = ({ children, selected, onClick }) => {
  return (
    <span
      onClick={onClick}
      className={`  rounded p-2 px-5 font-montserrat cursor-pointer ${
        selected ? " text-white font-bold" : "font-medium"
      } hover:bg-gold hover:text-black transition-colors duration-200`}
      style={{ width: "22%" }}
    >
      {children}
    </span>
  );
};

export default SelectButton;
