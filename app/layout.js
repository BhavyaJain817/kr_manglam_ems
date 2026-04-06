import './globals.css'
import { Poppins, Orbitron, Rajdhani } from 'next/font/google'

const poppins = Poppins({ 
  weight: ['300', '500', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

const orbitron = Orbitron({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

const rajdhani = Rajdhani({
  weight: ['300', '400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-rajdhani',
  display: 'swap',
})

export const metadata = {
  title: 'College Event Management System',
  description: 'A College Event Management System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${orbitron.variable} ${rajdhani.variable}`}>
      <body>{children}</body>
    </html>
  )
}
