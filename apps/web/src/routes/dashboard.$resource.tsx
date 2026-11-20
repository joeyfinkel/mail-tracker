import { Navigate, createFileRoute } from '@tanstack/react-router';
import { resources } from './-utils/dashboard-layout';
import { dashboardPageConfig } from './-utils/dashboard-page-config';

const dashboardResources = resources.omit('overview');

export const Route = createFileRoute('/dashboard/$resource')({
  component: ResourcePage,
});

function ResourcePage() {
  const { resource } = Route.useParams();

  if (!dashboardResources.isResource(resource)) {
    return <Navigate to="/dashboard" />;
  }

  return dashboardPageConfig.getComponent({ resource });
}
