const Input = ({ label, type = "text", id, placeholder, className = "", ...props}) => {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block font-montserrat text-lg text-slate-gray mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        className={`w-full px-4 py-3 border border-neutral rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-red font-montserrat ${className}`}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

export default Input;