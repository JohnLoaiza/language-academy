import { CSSProperties } from "react";

interface Styles {
  mainContainer: CSSProperties;
  header: CSSProperties;
  title: CSSProperties;
  button: CSSProperties;
  buttonHover: CSSProperties;
  grid: CSSProperties;
  thStyle: CSSProperties;
  tdStyle: CSSProperties;
  card: CSSProperties; 
  cardTitle: CSSProperties
  loading: CSSProperties
}

export const styles: Styles = {
    mainContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center', // Centrado vertical
      alignItems: 'center',     // Centrado horizontal
      height: '100%',
      width: '100%',
      padding: '1rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    button: {
      padding: '0.5rem 1rem',
      margin: '5px',
      backgroundColor: '#2563EB',
      color: 'white',
      border: 'none',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease-in-out',
      width: '20vw',
      maxWidth: '600px'
    },
    buttonHover: {
      backgroundColor: '#1E40AF',
    },
    grid: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1rem',
    },
    card: {
      padding: '1rem',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease-in-out',
       width: '50vw',
      maxWidth: '900px'
    },
    cardTitle: {
      fontSize: '1.125rem',
      fontWeight: 500,
      color: '#1f2937',
    },
    loading: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#6b7280',
    },
    thStyle: {
      padding: '8px',
      textAlign: 'left',
      borderBottom: '2px solid #cbd5e0',
    },
    tdStyle: {
      padding: "8px",
      textAlign: "left",
    }
  };