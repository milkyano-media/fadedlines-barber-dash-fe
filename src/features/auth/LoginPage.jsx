import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { useAuth } from './hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Toast from '@/shared/components/common/Toast';

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
      let errorMessage = 'An error occurred during login';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setToast({
        message: errorMessage,
        isVisible: true,
        type: 'error'
      });
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
