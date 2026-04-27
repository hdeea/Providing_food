
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/Auth/LoginForm';

const Login: React.FC = () => {
  const { isLoading } = useAuth();
 

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-700 via-emerald-600 to-slate-900 p-4">
      <LoginForm />
    </div>
  );
};

export default Login;
