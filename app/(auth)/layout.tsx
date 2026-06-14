// Auth route group layout — strips the global Navbar and Footer
// so auth pages render as standalone full-screen views.
export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
