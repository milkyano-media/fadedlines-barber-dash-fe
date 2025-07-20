import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { useAuth } from './hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Toast from '@/components/common/Toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', isVisible: false, type: 'success' });

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the previous location or use dashboard as default
  const from = location.state?.from?.pathname || '/dashboard';


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await login({ email, password });
      setToast({
        message: 'Login successful!',
        isVisible: true,
        type: 'success'
      });
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (err) {
      // Clear any existing error first
      setError('');
      
      let errorMessage = 'An error occurred during login';
      
      // Extract error message from different possible locations
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.statusText) {
        errorMessage = err.response.statusText;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Show error toast using DOM manipulation (React state not working reliably)
      const showErrorToast = (message) => {
        // Remove any existing error toast
        const existingToast = document.querySelector('.login-error-toast');
        if (existingToast) {
          existingToast.remove();
        }
        
        // Create new error toast
        const toastDiv = document.createElement('div');
        toastDiv.className = 'login-error-toast fixed bottom-4 right-4 z-50 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 rounded-lg shadow-lg p-3 flex items-center justify-between min-w-[300px] max-w-[500px] animate-in fade-in slide-in-from-bottom-5 duration-300';
        
        toastDiv.innerHTML = `
          <div class="flex items-center">
            <svg class="h-4 w-4 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm font-medium">${message}</span>
          </div>
          <button class="ml-3 flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors" onclick="this.parentElement.remove()">
            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        `;
        
        document.body.appendChild(toastDiv);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
          if (toastDiv.parentNode) {
            toastDiv.remove();
          }
        }, 4000);
      };
      
      showErrorToast(errorMessage);
      
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const hideToast = () => {
    setToast({ ...toast, isVisible: false });
  };


  return (
    <>
      <div className='flex h-[calc(100vh-4rem)] lg:h-screen w-full flex-col items-center justify-center overflow-hidden'>
        <div className='mx-auto flex w-full max-w-md flex-col justify-center space-y-6 px-4'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Welcome back
            </h1>
            <p className='text-sm text-muted-foreground'>
              Enter your email and password to sign in to your account
            </p>
          </div>
          
          <Card className='w-full'>
            <CardHeader>
              <CardTitle className='text-2xl'>Login</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='space-y-2'>
                  <label htmlFor='email' className='text-sm font-medium leading-none'>Email</label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='name@example.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    className='w-full'
                  />
                </div>
                <div className='space-y-2'>
                  <label htmlFor='password' className='text-sm font-medium leading-none'>Password</label>
                  <div className='relative'>
                    <Input
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      className='w-full pr-10'
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                      onClick={toggleShowPassword}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className='h-4 w-4 text-muted-foreground' />
                      ) : (
                        <Eye className='h-4 w-4 text-muted-foreground' />
                      )}
                    </Button>
                  </div>
                </div>
                
                {error && (
                  <div className='text-sm font-medium text-destructive mt-2'>{error}</div>
                )}

                <Button type='submit' className='w-full' disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className='flex flex-col space-y-2'>
              {/* <div className='text-sm text-center text-muted-foreground'>
                Don&apos;t have an account?{' '}
                <Button 
                  variant='link' 
                  className='p-0 h-auto font-normal' 
                  asChild
                >
                  <Link to='/register'>Register here</Link>
                </Button>
              </div> */}
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        type={toast.type}
      />
    </>
  );
};

export default LoginPage;
