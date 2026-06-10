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
  id,
  name,
  ...inputProps
}) => {
  const inputId = id || name;
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <div style={{ marginBottom: 16, ...containerStyle }}>
      {label && <label htmlFor={inputId} style={{ display: 'block', marginBottom: 4 }}>{label}</label>}
      <input
        {...inputProps}
        id={inputId}
        name={name}
        aria-describedby={errorId}
        aria-invalid={error ? true : undefined}
        style={{
          width: '100%',
          padding: '8px',
          border: error ? '1px solid red' : '1px solid #ccc',
          borderRadius: 4,
          outline: 'none',
          ...inputProps.style,
        }}
      />
      {error && <div id={errorId} role="alert" style={{ color: 'red', fontSize: 12, marginTop: 2 }}>{error}</div>}
    </div>
  );
};
export default TextField;
