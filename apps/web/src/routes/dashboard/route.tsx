import { Outlet, createFileRoute } from '@tanstack/react-router';

import { Shell } from './-utils/layout';

export const Route = createFileRoute('/dashboard')({
  component: DashboardRoute,
});

function DashboardRoute() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}
