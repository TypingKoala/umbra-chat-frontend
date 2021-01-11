import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { ChatConnection } from '../../api/ChatConnection';
import React from 'react';
import ResponsiveSidebar from '../ResponsiveSidebar';

describe("ResponsiveSidebar", () => {
  it('displays a close button when the size is small', () => {
    const mockSetShowSidebar = jest.fn((state) => {})
    render(<ResponsiveSidebar
      showSidebar={true}
      setShowSidebar={mockSetShowSidebar}
      size="small"
      chatConnection={new ChatConnection("", "", "")}
      setChatConnection={(state) => {}}
    />);
    const closeButton = screen.getByRole('button', { name: "Close Sidebar" });
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(mockSetShowSidebar.mock.calls.length).toBe(1);
    expect(mockSetShowSidebar.mock.calls[0][0]).toBe(false);
  });

  it('does not display a close button when the size is not small', () => {
    const sizes: ("small" | "medium" | "large")[] = ["medium", "large"];
    for (let i = 0; i < 2; i++) {
      const mockSetShowSidebar = jest.fn((state) => {})
      render(<ResponsiveSidebar
        showSidebar={true}
        setShowSidebar={mockSetShowSidebar}
        size={sizes[i]}
        chatConnection={new ChatConnection("", "", "")}
        setChatConnection={(state) => {}}
      />);
      const closeButton = screen.queryByRole('button', { name: "Close Sidebar" });
      expect(closeButton).toBe(null);
      cleanup();
    }
  });

  it('displays username editing when open', () => {
    const sizes: ("small" | "medium" | "large")[] = ["small", "medium", "large"];
    for (let i = 0; i < 3; i++) {
      render(<ResponsiveSidebar
        showSidebar={true}
        setShowSidebar={(state) => {}}
        size={sizes[i]}
        chatConnection={new ChatConnection("", "", "")}
        setChatConnection={(state) => {}}
      />);
      const usernameField = screen.getByLabelText('Display Name');
      expect(usernameField).toBeInTheDocument();
      const updateButton = screen.getByRole('button', { name: "Update display name" });
      expect(updateButton).toBeInTheDocument();
      cleanup();
    }
  });

  it('updates chat connection on update', () => {
    const mockSetChatConnection = jest.fn((state: ChatConnection) => {})
    render(<ResponsiveSidebar
      showSidebar={true}
      setShowSidebar={(state) => {}}
      size="medium"
      chatConnection={new ChatConnection("", "", "")}
      setChatConnection={mockSetChatConnection}
    />);
    const usernameField = screen.getByLabelText('Display Name');
    // enter new username
    fireEvent.change(usernameField, { target: { value: 'newname' }});
    expect(usernameField.value).toBe('newname');
    // update and check if chatConnection is updated
    const updateButton = screen.getByRole('button', { name: "Update display name" });
    fireEvent.click(updateButton);
    expect(mockSetChatConnection.mock.calls.length).toBe(1);
    expect(mockSetChatConnection.mock.calls[0][0].username).toBe("newname");
  });

  it('holds the current display name by default', () => {
    const mockSetChatConnection = jest.fn((state: ChatConnection) => {})
    render(<ResponsiveSidebar
      showSidebar={true}
      setShowSidebar={(state) => {}}
      size="medium"
      chatConnection={new ChatConnection("", "myusername", "")}
      setChatConnection={mockSetChatConnection}
    />);
    const usernameField = screen.getByLabelText('Display Name');
    expect(usernameField.value).toBe('myusername');
  });
})