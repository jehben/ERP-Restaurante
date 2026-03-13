import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'FinanceiroBurger',
  description: 'Sistema Inteligente de Gestão Financeira',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable}`}>
      <body className="font-sans text-gray-800 antialiased bg-[#FFF5F0] overflow-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
