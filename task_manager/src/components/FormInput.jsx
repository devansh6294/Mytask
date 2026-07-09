import React from 'react';

function FormInput({ label, type, placeholder, value, onChange, min }) {
  return (
    <div className="input-div">
      <label>{label}</label>
      <input 
        type={type} 
        placeholder={placeholder}
        value={value} 
        onChange={onChange} 
        min={min}
        required 
      />
    </div>
  );
}

export default FormInput;