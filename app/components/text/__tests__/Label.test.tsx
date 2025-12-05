import { render, screen } from '@testing-library/react-native';
import React from 'react';
import { Label } from '../Label';

describe('Label', () => {
  it('renders with text children', () => {
    render(<Label>Username</Label>);
    expect(screen.getByTestId('Label-text')).toBeTruthy();
    expect(screen.getByText('Username')).toBeTruthy();
  });

  it('renders with string children', () => {
    render(<Label>Email Address</Label>);
    expect(screen.getByText('Email Address')).toBeTruthy();
  });

  it('renders with number children', () => {
    render(<Label>{123}</Label>);
    expect(screen.getByText('123')).toBeTruthy();
  });

  it('renders with React element children', () => {
    render(
      <Label>
        <Label>Nested Label</Label>
      </Label>
    );
    expect(screen.getByText('Nested Label')).toBeTruthy();
  });

  it('applies default label styles', () => {
    render(<Label>Test Label</Label>);
    const labelText = screen.getByTestId('Label-text');
    expect(labelText.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          fontSize: 16,
          fontWeight: '600',
          color: '#000000',
          marginBottom: 8,
        }),
      ])
    );
  });

  it('applies custom style when provided', () => {
    const customStyle = { fontSize: 20, color: '#333333' };
    render(<Label style={customStyle}>Custom Label</Label>);
    const labelText = screen.getByTestId('Label-text');
    expect(labelText.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining(customStyle)])
    );
  });

  it('passes through TextProps', () => {
    render(
      <Label numberOfLines={1} ellipsizeMode="tail">
        Long Label Text
      </Label>
    );
    const labelText = screen.getByTestId('Label-text');
    expect(labelText.props.numberOfLines).toBe(1);
    expect(labelText.props.ellipsizeMode).toBe('tail');
  });

  it('renders with multiple children', () => {
    render(
      <Label>
        Required <Label>Field</Label>
      </Label>
    );
    // When nested, text is flattened, so we check for the inner text
    expect(screen.getByText('Field')).toBeTruthy();
    // Check that the component renders
    const labels = screen.getAllByTestId('Label-text');
    expect(labels.length).toBeGreaterThan(0);
  });

  it('handles empty children', () => {
    render(<Label>{''}</Label>);
    const labelText = screen.getByTestId('Label-text');
    expect(labelText).toBeTruthy();
  });

  it('renders with complex children structure', () => {
    render(
      <Label>
        <Label>First</Label> and <Label>Second</Label>
      </Label>
    );
    // When nested, we can find the inner labels
    expect(screen.getByText('First')).toBeTruthy();
    expect(screen.getByText('Second')).toBeTruthy();
    // Check that multiple Label components are rendered
    const labels = screen.getAllByTestId('Label-text');
    expect(labels.length).toBeGreaterThanOrEqual(2);
  });
});
