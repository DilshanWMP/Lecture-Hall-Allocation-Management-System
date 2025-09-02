import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from "../components/Nav";
import Footer from "../sections/Footer";
import { signInBenefits } from "../constants";
import Button from "../components/Button";
import Input from "../components/Input";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8088/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Save token to localStorage or context
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('isAdmin', data.admin);
        
        // Redirect to home or dashboard
        navigate('/');
        window.location.reload(); // Refresh to update auth state
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen">
      <Nav/>
      
      <section className="pt-20">
        <div className="pt-28 padding-x padding-b mt-10">
          <div className="max-container flex flex-col-reverse lg:flex-row gap-10">
            {/* Left Column - Benefits */}
            <div className="flex-1 bg-primary p-10 rounded-3xl text-neutral">
              <h2 className="font-palanquin text-4xl font-bold mb-6">One Account, Complete Control</h2>
              <p className="font-montserrat text-xl mb-8">Sign in to your administrator account to manage all lecture hall operations from a single portal!</p>
              
              <ul className="space-y-4">
                {signInBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <input type="checkbox" checked readOnly className="mt-1 mr-3 h-5 w-5 accent-coral-red" />
                    <span className="font-montserrat text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column - Login Form */}
            <div className="flex-1 flex justify-center items-start">
              <div className="w-full max-w-md bg-white rounded-3xl shadow-3xl p-8">
                <h2 className="font-palanquin text-3xl font-bold text-primary mb-6 text-center">Administrator Login</h2>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <Input
                    label="Email Address"
                    type="email"
                    id="email"
                    placeholder="Enter your admin email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <Input
                    label="Password"
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember"
                        className="h-4 w-4 accent-coral-red focus:ring-coral-red"
                      />
                      <label htmlFor="remember" className="ml-2 font-montserrat text-slate-gray">Remember Me</label>
                    </div>
                    
                    <a href="#" className="font-montserrat text-coral-red hover:underline">Forgot Password?</a>
                  </div>
                  
                  <Button
                    label={loading ? "Signing In..." : "Sign In"}
                    className="w-full rounded-lg py-3 px-4 hover:bg-opacity-90 transition-all duration-300 border-none font-medium disabled:opacity-50"
                    type="submit"
                    disabled={loading}
                  />
                </form>
                
                <p className="mt-6 text-center font-montserrat text-slate-gray">
                  Contact system administrator for access credentials
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
        
      <section className='bg-black padding-x padding-t pb-8'>
        <Footer/>
      </section>
    </main>
  );
};

export default SignIn;