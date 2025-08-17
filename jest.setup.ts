import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';
import React from 'react'

jest.mock('next/link', () => {
  const Link = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }>(
    ({ children, href, ...rest }, ref) =>
      React.createElement('a', { href, ref, ...rest }, children)
  );
  Link.displayName = 'Link';
  return { __esModule: true, default: Link };
});