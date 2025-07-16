
interface YearDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}

const YearDropdown = ({ value, onChange, placeholder, required = false }: YearDropdownProps) => {
  // Removed broken hooks
  const years = [];
  
  // Generate years from current year back to 1976
  for (let year = currentYear; year >= 1976; year--) {
    years.push(year.toString());
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E10600] focus:border-transparent"
    >
      <option value="">{placeholder}</option>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
};

export default YearDropdown;
