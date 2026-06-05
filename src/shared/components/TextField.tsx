import React from 'react';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerStyle?: React.CSSProperties;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  containerStyle,
  ...inputProps
}) => {
  return (
    <div style={{ marginBottom: 16, ...containerStyle }}>
      {label && <label style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
      <input
        {...inputProps}
        style={{
          width: '100%',
          padding: '8px',
          border: error ? '1px solid red' : '1px solid #ccc',
          borderRadius: 4,
          outline: 'none',
          ...inputProps.style,
        }}
      />
      {error && <div style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{error}</div>}
    </div>
  );
};

export default TextField;
