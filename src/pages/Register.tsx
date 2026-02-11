import { RegisterForm } from '@/components/auth/RegisterForm';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Register() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md mb-6">
                <Link
                    to="/"
                    className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar ao site
                </Link>
            </div>
            <RegisterForm />
        </div>
    );
}
