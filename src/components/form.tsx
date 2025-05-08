import { useState } from "react";
import { styles } from "../styles";

interface DynamicFormProps {
  fields: string[];
  onSubmit: (data: any) => void;
  onClose: () => void;
  title?: string;
}

export function DynamicForm<T>({ fields, onSubmit, onClose, title = "Nuevo curso" }: DynamicFormProps) {
  const [formData, setFormData] = useState<Partial<T>>({});

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData as T);
  };

  return (
    <div style={{ ...styles.mainContainer, maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={styles.title}>{title}</h2>

      {fields.map((field) => (
        <div key={String(field)} style={{ marginBottom: '1rem', width: '100%' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>{String(field)}</label>
          <input
            type="text"
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '0.375rem',
            }}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <button style={styles.button} onClick={handleSubmit}>
          Crear
        </button>
        <button
          style={{ ...styles.button, backgroundColor: '#DC2626' }}
          onClick={onClose}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#B91C1C')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#DC2626')}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
