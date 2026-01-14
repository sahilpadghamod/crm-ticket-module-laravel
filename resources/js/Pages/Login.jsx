import { Link, useForm } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        // MainLayout
        <MainLayout>
            <div className="auth-wrapper">
                <div className="auth-card">
                    {/* Logo */}
                    <div style={{ marginBottom: '1rem' }}>
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                            <rect width="24" height="24" rx="12" fill="#2563eb" />
                            <path d="M7 12L10 15L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <h2>User Login</h2>
                    <p className="subtitle">Enter your credentials to access the portal</p>

                    {errors.email && (
                        <div style={{
                            background: '#fef2f2', color: '#b91c1c', padding: '10px',
                            borderRadius: '6px', fontSize: '14px', marginBottom: '15px',
                            border: '1px solid #fee2e2'
                        }}>
                            {errors.email}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className="form-group">
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" disabled={processing} style={{ opacity: processing ? 0.7 : 1 }}>
                            {processing ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    <p className="footer-text">
                        Don't have an account? <Link href="/register">Register now</Link>
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}