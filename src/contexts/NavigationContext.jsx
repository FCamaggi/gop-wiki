import React, { createContext, useContext, useState, useEffect } from 'react';
import navigationService from '../services/content/navigationService';
import useLocalStorage from '../hooks/common/useLocalStorage';

const NavigationContext = createContext(null);

export function NavigationProvider({ children }) {
  const [navigation, setNavigation] = useState({});
  const [activeSection, setActiveSection] = useLocalStorage(
    'activeSection',
    'classes'
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNavigation = async () => {
      try {
        const data = await navigationService.getNavigation();
        setNavigation(data);
      } catch (err) {
        setError(err.message);
        console.error('Error loading navigation:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNavigation();
  }, []);

  const value = {
    navigation,
    activeSection,
    setActiveSection,
    loading,
    error,
    getSectionLabel: navigationService.getSectionLabel,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error(
      'useNavigationContext must be used within a NavigationProvider'
    );
  }
  return context;
}
