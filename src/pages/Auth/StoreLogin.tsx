import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { z } from 'zod';

export default function StoreLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  const result = await login(email, password);

  if (!result) {  
    setError("فشل تسجيل الدخول، تأكد من بياناتك");
    return;
  }

  if (result.role?.toLowerCase() !== "store owner") {
    setError("هذا الحساب ليس حساب متجر، قم بإنشاء حساب جديد أولاً");
    return;
  }

  navigate("/store/dashboard");
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 border-t-4 border-blue-500">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">دخول المتاجر الغذائية</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="البريد الإلكتروني للمتجر"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            تسجيل الدخول للمتجر
          </Button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="text-center mt-3">
  <span className="text-sm text-gray-600">ليس لديك حساب؟ </span>
  <button
    type="button"
    onClick={() => navigate("/register")}
    className="text-blue-600 hover:underline text-sm"
  >
    إنشاء حساب
  </button>
</div>

        </form>
      </div>
    </div>
  );
}