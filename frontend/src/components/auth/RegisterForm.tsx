import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface RegisterFormState {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'Admin' | 'Developer' | 'Sales Agent';
}

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormState>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Sales Agent',
  });
  const [localError, setLocalError] = useState('');
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError('');

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      setLocalError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });
      navigate('/');
    } catch (err) {
      setLocalError('Registration failed. Please try again.');
    }
  };

  return (
    <div className='w-full max-w-md p-8 rounded-lg border border-gray-200 bg-white shadow-md'>
      <div className='text-center mb-8'>
        <h2 className='text-3xl font-bold text-gray-800'>Create Account</h2>
        <p className='text-gray-500 text-sm mt-2'>Join our platform today</p>
      </div>

      <form onSubmit={handleSubmit}>
        {(error || localError) && (
          <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm'>
            {error || localError}
          </div>
        )}

        <div className='mb-4'>
          <label htmlFor="name" className='block text-sm font-medium text-gray-700 mb-2'>
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder='John Doe'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
          />
        </div>

        <div className='mb-4'>
          <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-2'>
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder='you@example.com'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
          />
        </div>

        <div className='mb-4'>
          <label htmlFor="phone" className='block text-sm font-medium text-gray-700 mb-2'>
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder='+1 (555) 000-0000'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
          />
        </div>

        <div className='mb-4'>
          <label htmlFor="role" className='block text-sm font-medium text-gray-700 mb-2'>
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
          >
            <option value="Sales Agent">Sales Agent</option>
            <option value="Developer">Developer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div className='mb-4'>
          <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-2'>
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder='••••••••'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
          />
        </div>

        <div className='mb-6'>
          <label htmlFor="confirmPassword" className='block text-sm font-medium text-gray-700 mb-2'>
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder='••••••••'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className='w-full py-2 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-md transition duration-200'
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className='text-center text-gray-600 text-sm mt-6'>
        Already have an account?{' '}
        <Link to="/login" className='text-green-600 hover:text-green-700 font-medium'>
          Login here
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
