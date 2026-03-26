import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import OverviewDashboard from '@/components/dashboard/OverviewDashboard';

describe('Smoke test', () => {
  it('renders OverviewDashboard without crashing', () => {
    const { container } = render(<OverviewDashboard tasks={[]} agents={[]} />);
    expect(container).toBeTruthy();
  });
});
