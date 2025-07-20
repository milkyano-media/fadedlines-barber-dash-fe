import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from './hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Toast from '@/shared/components/common/Toast';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', isVisible: false, type: 'success' });

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      const userData = {
        name,
        email,
        password
      };

      await register(userData);
      setToast({
        message: 'Account created successfully!',
        isVisible: true,
        type: 'success'
      });
      
      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1500);
    } catch (err) {
      let errorMessage = 'Registration failed';
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

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
              Create an account
            </h1>
            <p className='text-sm text-muted-foreground'>
              Enter your information to create your account
            </p>
          </div>
          
          <Card className='w-full'>
            <CardHeader>
              <CardTitle className='text-2xl'>Register</CardTitle>
              <CardDescription>
                Fill in your details to create a new account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='space-y-2'>
                  <label htmlFor='name' className='text-sm font-medium leading-none'>Name</label>
                  <Input
                    id='name'
                    type='text'
                    placeholder='Your full name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    required
                    className='w-full'
                  />
                </div>
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
                      placeholder='At least 6 characters'
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
                <div className='space-y-2'>
                  <label htmlFor='confirmPassword' className='text-sm font-medium leading-none'>Confirm Password</label>
                  <div className='relative'>
                    <Input
                      id='confirmPassword'
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      className='w-full pr-10'
                      placeholder='Confirm your password'
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                      onClick={toggleShowConfirmPassword}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
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
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className='flex flex-col space-y-2'>
              <div className='text-sm text-center text-muted-foreground'>
                Already have an account?{' '}
                <Button 
                  variant='link' 
                  className='p-0 h-auto font-normal' 
                  asChild
                >
                  <Link to='/login'>Login here</Link>
                </Button>
              </div>
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

export default RegisterPage;
