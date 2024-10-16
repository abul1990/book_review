
'use client';

import { usePathname } from 'next/navigation';
import Navbar from './components/Navbar';
import { CustomThemeProvider } from './components/CustomThemeProvider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <CustomThemeProvider>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <html lang="en">
        <body>
          <Navbar/>
          <main style={{ padding: '16px' }}>{children}</main>
        </body>
      </html>
      </LocalizationProvider>
    </CustomThemeProvider>
  );
}

