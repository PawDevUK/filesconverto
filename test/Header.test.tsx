import { render, screen } from '@testing-library/react';
import Header from '@/app/components/Header';
import { axe } from 'jest-axe';

test('Test render Header.', () => {
	render(<Header></Header>);
	const header = screen.getByRole('banner');
	expect(header).toBeInTheDocument();
});

test('Test if accessibility.', async () => {
	const { container } = render(<Header />);
	const results = await axe(container);
	expect(results).toHaveNoViolations();
});
