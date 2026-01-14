import { Link, useForm } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <MainLayout>
            <div className="auth-wrapper">
                <div className="auth-card">
                    <h2>Create Account</h2>
                    
                    {errors.email && <p style={{color: 'red'}}>{errors.email}</p>}

                    <form onSubmit={submit}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                        </div>

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

                        <button type="submit" disabled={processing}>
                            {processing ? "Registering..." : "Register"}
                        </button>
                    </form>
                    <p className="footer-text">
                        Already have an account? <Link href="/">Login</Link>
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}