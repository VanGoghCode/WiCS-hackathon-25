import { SelectInputProps } from "../../Types/types";

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  required = false,
}) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-amber-900">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full p-2 border border-amber-300 rounded-md ${
          disabled ? "bg-amber-100 cursor-not-allowed" : "bg-white"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;