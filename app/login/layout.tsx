export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 flex items-center justify-center min-h-screen">
        <main className="w-full max-w-md p-8 bg-white rounded shadow">{children}</main>
      </body>
    </html>
  );
}