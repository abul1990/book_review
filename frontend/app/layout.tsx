
'use client';

import Navbar from './components/Navbar';
import { CustomThemeProvider } from './components/CustomThemeProvider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'


export default function RootLayout({ children }: { children: React.ReactNode }) {

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

