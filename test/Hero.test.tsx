import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Hero from '../app/Main/Hero';

// Mock the file upload hook to avoid network/side-effects
jest.mock('@/app/hooks/useFileUpload', () => ({
  __esModule: true,
  default: () => ({ uploadFile: jest.fn(), state: { isLoading: false, error: undefined, response: undefined } }),
}));

// Mock react-dropzone so it doesn't try to touch browser APIs in a strange way
jest.mock('react-dropzone', () => ({
  useDropzone: () => ({
    getRootProps: () => ({}),
    getInputProps: () => ({}),
    isDragActive: false,
  }),
}));

// Mock child components that are not essential to this smoke test
// NOTE: use the same module path that Hero imports (relative path from test file)
jest.mock('../app/Main/ServiceInfoCards', () => {
  const ServiceInfoCardsMock = () => React.createElement('div', { 'data-testid': 'service-cards' });
  ServiceInfoCardsMock.displayName = 'ServiceInfoCardsMock';
  return { __esModule: true, default: ServiceInfoCardsMock };
});
jest.mock('../app/Main/Uploads', () => {
  const UploadsMock = () => React.createElement('div', { 'data-testid': 'uploads-list' });
  UploadsMock.displayName = 'UploadsMock';
  return { __esModule: true, default: UploadsMock };
});

describe('Hero component', () => {
  it('renders without crashing', () => {
    const { container } = render(React.createElement(Hero));
    expect(container).toBeInTheDocument();
    // Optional: check children rendered by our mocks
    expect(screen.getByTestId('uploads-list')).toBeInTheDocument();
  });
});
