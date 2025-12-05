import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { TextInput } from 'react-native';
import { FormTextInput } from '../FormTextInput';

describe('FormTextInput', () => {
  it('renders with basic props', () => {
    render(<FormTextInput placeholder="Enter text" />);
    expect(screen.getByTestId('FormTextInput-wrapper')).toBeTruthy();
    expect(screen.getByTestId('FormTextInput-container')).toBeTruthy();
    expect(screen.getByTestId('FormTextInput-input')).toBeTruthy();
  });

  it('renders with label', () => {
    render(<FormTextInput label="Username" placeholder="Enter username" />);
    expect(screen.getByTestId('FormTextInput-label')).toBeTruthy();
    expect(screen.getByText('Username')).toBeTruthy();
  });

  it('does not render label when label prop is not provided', () => {
    render(<FormTextInput placeholder="Enter text" />);
    expect(screen.queryByTestId('FormTextInput-label')).toBeNull();
  });

  it('renders error message when error prop is provided', () => {
    render(<FormTextInput error="This field is required" />);
    const errorComponent = screen.getByTestId('FormTextInput-error');
    expect(errorComponent).toBeTruthy();
    expect(screen.getByText('This field is required')).toBeTruthy();
  });

  it('does not render error message when error prop is not provided', () => {
    render(<FormTextInput placeholder="Enter text" />);
    expect(screen.queryByTestId('FormTextInput-error')).toBeNull();
    expect(screen.queryByText(/error/i)).toBeNull();
  });

  it('shows loading indicator when loading is true', () => {
    render(<FormTextInput loading placeholder="Enter text" />);
    expect(screen.getByTestId('FormTextInput-loading-indicator')).toBeTruthy();
  });

  it('hides loading indicator when loading is false', () => {
    render(<FormTextInput loading={false} placeholder="Enter text" />);
    expect(screen.queryByTestId('FormTextInput-loading-indicator')).toBeNull();
  });

  it('applies error styles when error is present', () => {
    render(<FormTextInput error="Error message" placeholder="Enter text" />);
    const input = screen.getByTestId('FormTextInput-input');
    expect(input).toBeTruthy();
    // The error style should be applied (borderColor: '#FF0000')
    expect(input.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          borderColor: '#FF0000',
        }),
      ])
    );
  });

  it('applies loading styles when loading is true', () => {
    render(<FormTextInput loading placeholder="Enter text" />);
    const input = screen.getByTestId('FormTextInput-input');
    expect(input).toBeTruthy();
    expect(input.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          paddingRight: 40,
        }),
      ])
    );
  });

  it('handles text input changes', () => {
    const onChangeText = jest.fn();
    render(
      <FormTextInput placeholder="Enter text" onChangeText={onChangeText} />
    );
    const input = screen.getByTestId('FormTextInput-input');
    fireEvent.changeText(input, 'Hello World');
    expect(onChangeText).toHaveBeenCalledWith('Hello World');
    expect(onChangeText).toHaveBeenCalledTimes(1);
  });

  it('forwards ref to TextInput', () => {
    const ref = React.createRef<TextInput>();
    render(<FormTextInput ref={ref} placeholder="Enter text" />);
    expect(ref.current).toBeTruthy();
    expect(ref.current).toBeInstanceOf(TextInput);
  });

  it('passes through TextInput props', () => {
    render(
      <FormTextInput
        placeholder="Enter text"
        value="Test value"
        editable={false}
        keyboardType="email-address"
      />
    );
    const input = screen.getByTestId('FormTextInput-input');
    expect(input.props.value).toBe('Test value');
    expect(input.props.editable).toBe(false);
    expect(input.props.keyboardType).toBe('email-address');
  });

  it('applies custom container style', () => {
    const customStyle = { marginTop: 20 };
    render(
      <FormTextInput containerStyle={customStyle} placeholder="Enter text" />
    );
    const wrapper = screen.getByTestId('FormTextInput-wrapper');
    expect(wrapper.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(customStyle)])
    );
  });

  it('applies custom input style', () => {
    const customStyle = { fontSize: 20 };
    render(<FormTextInput style={customStyle} placeholder="Enter text" />);
    const input = screen.getByTestId('FormTextInput-input');
    expect(input.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(customStyle)])
    );
  });

  it('has correct placeholder text color', () => {
    render(<FormTextInput placeholder="Enter text" />);
    const input = screen.getByTestId('FormTextInput-input');
    expect(input.props.placeholderTextColor).toBe('#999999');
  });

  it('shows loading indicator with correct color', () => {
    render(<FormTextInput loading placeholder="Enter text" />);
    const indicator = screen.getByTestId('FormTextInput-loading-indicator');
    expect(indicator.props.color).toBe('#007AFF');
    expect(indicator.props.size).toBe('small');
  });

  it('renders correctly with all props', () => {
    const onChangeText = jest.fn();
    render(
      <FormTextInput
        label="Full Name"
        error="Name is required"
        loading={false}
        placeholder="Enter your name"
        value="John Doe"
        onChangeText={onChangeText}
      />
    );
    expect(screen.getByTestId('FormTextInput-wrapper')).toBeTruthy();
    expect(screen.getByTestId('FormTextInput-label')).toBeTruthy();
    expect(screen.getByText('Full Name')).toBeTruthy();
    expect(screen.getByTestId('FormTextInput-input')).toBeTruthy();
    expect(screen.getByTestId('FormTextInput-error')).toBeTruthy();
    expect(screen.getByText('Name is required')).toBeTruthy();
    expect(screen.queryByTestId('FormTextInput-loading-indicator')).toBeNull();
  });
});
