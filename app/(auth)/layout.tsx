export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-login-page flex min-h-screen flex-col">{children}</div>
  );
}
