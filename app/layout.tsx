
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  weight:"400"
})
const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={playfair.className}>
        <div className=" min-h-screen bg-custom-gradient-1">

          <main className="flex-grow p-20" >
            {children}
          </main>


        </div>
        

      </body>
    </html>
  );
}
