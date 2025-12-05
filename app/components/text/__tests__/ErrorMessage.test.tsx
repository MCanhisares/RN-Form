import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { ErrorMessage } from '../ErrorMessage';

describe('ErrorMessage', () => {
  it('renders error message when message prop is provided', () => {
    render(<ErrorMessage message="This field is required" />);
    expect(screen.getByTestId('ErrorMessage-text')).toBeTruthy();
    expect(screen.getByText('This field is required')).toBeTruthy();
  });

  it('does not render when message prop is not provided', () => {
    render(<ErrorMessage />);
    expect(screen.queryByTestId('ErrorMessage-text')).toBeNull();
  });

  it('does not render when message is empty string', () => {
    render(<ErrorMessage message="" />);
    expect(screen.queryByTestId('ErrorMessage-text')).toBeNull();
  });

  it('applies default error text styles', () => {
    render(<ErrorMessage message="Error message" />);
    const errorText = screen.getByTestId('ErrorMessage-text');
    expect(errorText.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          color: '#FF0000',
          fontSize: 14,
          marginTop: 4,
        }),
      ])
    );
  });

  it('applies custom style when provided', () => {
    const customStyle = { fontSize: 18, color: '#CC0000' };
    render(<ErrorMessage message="Error message" style={customStyle} />);
    const errorText = screen.getByTestId('ErrorMessage-text');
    expect(errorText.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(customStyle)])
    );
  });

  it('passes through TextProps', () => {
    render(
      <ErrorMessage
        message="Error message"
        numberOfLines={2}
        ellipsizeMode="tail"
      />
    );
    const errorText = screen.getByTestId('ErrorMessage-text');
    expect(errorText.props.numberOfLines).toBe(2);
    expect(errorText.props.ellipsizeMode).toBe('tail');
  });

  it('renders with different error messages', () => {
    const { rerender } = render(<ErrorMessage message="First error" />);
    expect(screen.getByText('First error')).toBeTruthy();

    rerender(<ErrorMessage message="Second error" />);
    expect(screen.getByText('Second error')).toBeTruthy();
    expect(screen.queryByText('First error')).toBeNull();
  });

  it('handles long error messages', () => {
    const longMessage =
      'This is a very long error message that might wrap to multiple lines';
    render(<ErrorMessage message={longMessage} />);
    expect(screen.getByText(longMessage)).toBeTruthy();
  });
});
