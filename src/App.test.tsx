import { render } from '@testing-library/react';
import React from 'react';
import Application from 'src/App';

test('Render Application', () => {
  const { container } = render(<Application />);
  expect(container.firstChild).toHaveClass('app');
});
