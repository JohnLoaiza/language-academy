export const styles = {
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
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '1rem',
      overflowY: 'auto' as const,
    },
    card: {
      padding: '1rem',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease-in-out',
       width: '30vw',
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
    }
  };