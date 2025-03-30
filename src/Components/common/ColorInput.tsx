import { useState } from "react";
import { ColorInputProps } from "../../Types/types";

const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const presetColors = [
    "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", 
    "#ffff00", "#00ffff", "#ff00ff", "#c0c0c0", "#808080",
    "#800000", "#808000", "#008000", "#800080", "#008080", "#000080"
  ];

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-amber-900">
        {label}
      </label>
      <div className="relative">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setShowPicker(!showPicker)}
        >
          <div 
            className="w-6 h-6 rounded-full border border-amber-300"
            style={{ backgroundColor: value }}
          />
          <span className="text-sm">{value}</span>
        </div>
        
        {showPicker && (
          <div className="absolute z-10 mt-2 p-3 bg-white border border-amber-200 rounded-lg shadow-lg">
            <div className="grid grid-cols-8 gap-2 mb-2">
              {presetColors.map(color => (
                <div
                  key={color}
                  className="w-6 h-6 rounded-full cursor-pointer hover:ring-2 hover:ring-amber-500"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    onChange(color);
                    setShowPicker(false);
                  }}
                />
              ))}
            </div>
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorInput;