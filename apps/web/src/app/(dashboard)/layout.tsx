import { Sidebar } from '../../components/layout/sidebar';
import { Header } from '../../components/layout/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-transparent relative z-10 print:block print:min-h-0 print:h-auto print:overflow-visible">
      <Sidebar />
      <div className="flex-1 flex flex-col print:block print:h-auto print:overflow-visible">
        <Header />
        <main className="flex-1 p-6 md:p-10 overflow-auto print:overflow-visible print:h-auto print:p-0">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
