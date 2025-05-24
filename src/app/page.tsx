import { Permanent_Marker } from 'next/font/google';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LoginClientForm } from './(auth)/login/_components/LoginForm';

// If you're using a specific font
const permanentMarker = Permanent_Marker({
  subsets: ['latin'],
  weight: '400',
});

export default async function LoginPage() {
  // Check if user is already authenticated on the server side
  const session = await auth();
  if (session) {
    if (session.user?.role === 'admin') {
      redirect('/admin/dashboard');
    } else if (session.user?.role === 'cashier') {
      redirect('/cashier/dashboard');
    } else {
      redirect('/'); // Fallback
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Left Column: POS Billing Image */}
      <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-emerald-600 to-emerald-900 dark:from-emerald-700 dark:to-emerald-950 text-white p-8">
        <h1 className={`text-6xl font-bold mb-4 ${permanentMarker.className}`}>Root & Seed POS</h1>
        <p className="text-xl text-center mb-8">
          Streamlining Your Business Operations with Smart Solutions.
        </p>
        {/* Replace with your actual image */}
        <div className="relative w-full max-w-md h-64 bg-emerald-700 dark:bg-emerald-800 rounded-lg flex items-center justify-center overflow-hidden">
          <svg className="w-32 h-32 text-emerald-300 dark:text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 8H2V6h20v2zM2 10h20v10H2V10zm11 3h3v3h-3v-3z"></path>
          </svg>
          <span className="absolute bottom-4 text-emerald-200 dark:text-emerald-400 text-sm">Your POS Billing System Visual</span>
        </div>
        <p className="text-md text-center mt-8">
          Efficiency, Accuracy, and Growth – All in one place.
        </p>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">Welcome Back!</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Sign in to your account</p>

          {/* Render the client-side login form */}
          <LoginClientForm />
        </div>
      </div>
    </div>
  );
}