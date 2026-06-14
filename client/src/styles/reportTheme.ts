// Global styles for medical reports
import { createTheme } from '@mui/material/styles';

export const reportTheme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#8aa5f0',
      dark: '#5568d3'
    },
    secondary: {
      main: '#764ba2',
      light: '#9267b5',
      dark: '#633d8b'
    },
    success: {
      main: '#26a69a',
      light: '#52bfb1',
      dark: '#00897b'
    },
    warning: {
      main: '#ffa726',
      light: '#ffb74d',
      dark: '#fb8c00'
    },
    error: {
      main: '#ef5350',
      light: '#e57373',
      dark: '#c62828'
    },
    info: {
      main: '#29b6f6',
      light: '#4fc3f7',
      dark: '#0277bd'
    }
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif, "Arial", "Helvetica"',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.5px',
      color: '#333'
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.25px',
      color: '#333'
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#333'
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#333'
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#333'
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#333'
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#666'
    },
    body2: {
      fontSize: '0.95rem',
      lineHeight: 1.5,
      color: '#666'
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.95rem'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)'
          }
        },
        contained: {
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s ease',
            '&:hover fieldset': {
              borderColor: '#667eea'
            },
            '&.Mui-focused fieldset': {
              borderColor: '#667eea',
              boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
            }
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          fontWeight: 500,
          fontSize: '0.85rem'
        }
      }
    }
  }
});
