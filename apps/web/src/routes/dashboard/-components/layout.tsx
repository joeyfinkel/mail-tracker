export function DashboardLayout({ children }: { children?: React.ReactNode }) {
  return <div className="min-h-screen bg-muted/30 text-foreground md:grid md:grid-cols-[15rem_1fr]">{children}</div>;
}

export function DashboardSidebar({ children }: { children?: React.ReactNode }) {
  return <aside className="border-b bg-background md:min-h-screen md:border-r md:border-b-0">{children}</aside>;
}

export function DashboardContent({ children }: { children?: React.ReactNode }) {
  return <div className="min-w-0">{children}</div>;
}

export function DashboardHeader({ children }: { children?: React.ReactNode }) {
  return <header className="flex h-16 items-center justify-between border-b bg-background px-5 lg:px-8">{children}</header>;
}

export function DashboardResourceLayout({ children }: { children?: React.ReactNode }) {
  return <main className="space-y-6 p-5 lg:p-8">{children}</main>;
}

export function DashboardResourceHeading({ children }: { children?: React.ReactNode }) {
  return <section>{children}</section>;
}
