export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='h-screen grid place-items-center bg-gradient-to-r from-indigo-300 to-purple-400'>
      {children}
    </div>
  );
}
