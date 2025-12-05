import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with title', () => {
    render(<Button title="Click me" />);
    expect(screen.getByText('Click me')).toBeTruthy();
  });

  it('renders primary variant by default', () => {
    const { getByText } = render(<Button title="Primary Button" />);
    const button = getByText('Primary Button').parent;
    expect(button).toBeTruthy();
  });

  it('renders secondary variant', () => {
    render(<Button title="Secondary Button" variant="secondary" />);
    expect(screen.getByText('Secondary Button')).toBeTruthy();
  });

  it('shows loading indicator when loading is true', () => {
    render(<Button title="Loading Button" loading />);
    expect(screen.getByTestId('ActivityIndicator')).toBeTruthy();
  });

  it('hides text when loading', () => {
    render(<Button title="Loading Button" loading />);
    expect(screen.queryByText('Loading Button')).toBeNull();
  });

  it('shows text when not loading', () => {
    render(<Button title="Not Loading" loading={false} />);
    expect(screen.getByText('Not Loading')).toBeTruthy();
    expect(screen.queryByTestId('ActivityIndicator')).toBeNull();
  });

  it('button is disabled when loading', () => {
    render(<Button title="Any" loading />);
    const button = screen.getByTestId('Button');
    expect(button).toBeDisabled();
  });

  it('button is disabled when disabled prop is true', () => {
    render(<Button title="Disabled" disabled />);
    const button = screen.getByTestId('Button');
    expect(button).toBeDisabled();
  });

  it('button is disabled when both loading and disabled', () => {
    render(<Button title="Disabled Loading" loading disabled />);
    const button = screen.getByTestId('Button');
    expect(button).toBeDisabled();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Press me" onPress={onPress} />);
    const button = getByText('Press me');
    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(<Button title="Disabled" onPress={onPress} disabled />);
    const button = screen.getByTestId('Button');
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('does not call onPress when loading', () => {
    const onPress = jest.fn();
    render(<Button title="Loading" onPress={onPress} loading />);
    const button = screen.getByTestId('Button');
    fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows correct activity indicator color for primary variant', () => {
    render(<Button title="Primary Loading" loading variant="primary" />);
    const indicator = screen.getByTestId('ActivityIndicator');
    expect(indicator.props.color).toBe('#FFFFFF');
  });

  it('shows correct activity indicator color for secondary variant', () => {
    render(<Button title="Secondary Loading" loading variant="secondary" />);
    const indicator = screen.getByTestId('ActivityIndicator');
    expect(indicator.props.color).toBe('#007AFF');
  });
});
