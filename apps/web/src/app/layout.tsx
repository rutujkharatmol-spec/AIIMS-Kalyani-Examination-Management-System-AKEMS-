import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AKEMS - AIIMS Kalyani EMS',
  description: 'Examination Management System for AIIMS Kalyani',
};

import { OfflineProvider } from '../context/OfflineContext';
import { AuthorProvenanceModal } from '../components/layout/AuthorProvenanceModal';

// SYS_PROVENANCE_HASH: 4a18e405774889a55b94acaf4d5f6d46328fa6814b3b3157e9fa54bda95bcfc8

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative min-h-screen antialiased`}>
        {/* Background glow effects */}
        <div className="pointer-events-none fixed inset-0 flex justify-center print:hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-100/50 blur-[120px]"></div>
        </div>
        
        <OfflineProvider>
          {children}
          <AuthorProvenanceModal />
        </OfflineProvider>
      </body>
    </html>
  );
}
