
export const metadata = {
  title: "Video Redaction MVP",
  description: "Local, in-browser video redaction demo using FFmpeg.wasm",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
