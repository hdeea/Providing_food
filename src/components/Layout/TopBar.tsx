import React, { useState, useEffect } from 'react';
import { Menu, LogOut, ChevronDown, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const TopBar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("providing-food-theme");
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;

    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("providing-food-theme", isDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 shadow-sm fixed top-0 right-0 left-0 z-40 transition-colors duration-500 dark:bg-slate-900 dark:border-slate-700">
      
      {/* RIGHT SIDE — الهامبرغر + اللوجو */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-2">
          <div className="bg-brand-blue text-white font-bold text-xl px-2 py-1 rounded dark:bg-emerald-600">
            PF
          </div>
          <span className="text-xl font-semibold text-gray-900 dark:text-slate-100">
            Providing Food
          </span>
        </div>
      </div>

      {/* CENTER — Theme Toggle */}
      <div className="flex-1 flex justify-center">
        <button
          onClick={() => setIsDarkMode((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          {isDarkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* LEFT SIDE — اسم المستخدم + الصورة */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <span className="text-sm text-gray-700 hidden md:block dark:text-slate-300">
            {user?.fullName || 'Admin'}
          </span>
          <ChevronDown size={18} className="text-gray-600 dark:text-slate-400" />
        </div>

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback className="bg-emerald-600 text-white font-bold text-lg dark:bg-emerald-500">
                {user?.fullName?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="dark:bg-slate-800 dark:border-slate-700">
            <DropdownMenuLabel className="dark:text-slate-200">حسابي</DropdownMenuLabel>
            <DropdownMenuSeparator className="dark:bg-slate-700" />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-600 cursor-pointer dark:text-red-400 dark:hover:bg-slate-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>تسجيل خروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;
