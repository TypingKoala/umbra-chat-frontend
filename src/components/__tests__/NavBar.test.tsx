import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import NavBar from '../NavBar';
import React from 'react';

describe("NavBar", () => {
  it('renders chat app name', () => {
    render(<NavBar
      setDarkMode={(state) => {}}
      darkMode={true}
      showSidebar={true}
      setShowSidebar={(state) => {}} />);
    expect(screen.getByText('Umbra')).toBeInTheDocument();
  });
  
  it('calls the setDarkMode function on toggle', () => {
    const currentDarkModeState = [true, false];
    for (let i = 0; i < 2; i++) {
      const mockSetDarkMode = jest.fn((state) => {})
      const mockSetShowSidebar = jest.fn((state) => {})
      render(<NavBar
        setDarkMode={state => mockSetDarkMode(state)}
        darkMode={currentDarkModeState[i]}
        showSidebar={true}
        setShowSidebar={state => mockSetShowSidebar(state)} />);
      fireEvent.click(screen.getByRole('button', { name: 'Toggle Dark Mode' }));
      // check if the correct number of function calls
      expect(mockSetDarkMode.mock.calls.length).toBe(1);
      expect(mockSetShowSidebar.mock.calls.length).toBe(0);
      // check if it correctly toggles the state
      expect(mockSetDarkMode.mock.calls[0][0]).toBe(!currentDarkModeState[i]);
      cleanup();
    }
  });

  it('calls the setShowSidebar function on toggle', () => {
    const currentSidebarState = [true, false];
    for (let i = 0; i < 2; i++) {
      const mockSetDarkMode = jest.fn((state) => {})
      const mockSetShowSidebar = jest.fn((state) => {})
      render(<NavBar
        setDarkMode={state => mockSetDarkMode(state)}
        darkMode={true}
        showSidebar={currentSidebarState[i]}
        setShowSidebar={state => mockSetShowSidebar(state)} />);
      fireEvent.click(screen.getByRole('button', { name: 'Toggle Sidebar' }));
      // check if the correct number of function calls
      expect(mockSetDarkMode.mock.calls.length).toBe(0);
      expect(mockSetShowSidebar.mock.calls.length).toBe(1);
      // check if it correctly toggles the state
      expect(mockSetShowSidebar.mock.calls[0][0]).toBe(!currentSidebarState[i]);
      cleanup();
    }
  });
})