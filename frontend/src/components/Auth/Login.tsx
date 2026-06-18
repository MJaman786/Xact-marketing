import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import useLogin from "../../hooks/Auth/useLogin";
import { useAuthStore } from "../../store/Auth/useAuthStore";
import { useNavigate } from "react-router-dom";

// --- Validation Schema ---
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});


export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const userNavigate = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return navigate(`/super-admin/dashboard`);
      case 'ADMIN': return navigate(`/admin/dashboard`);
      case 'USER': return navigate(`/user/dashboard`);
      default: return navigate(`/unauthorized`);
    }
  }

  const { mutate: userLogin, isPending: isLoggingUser } = useLogin();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: LoginSchema,
    onSubmit: (data, action) => {
      userLogin({ email: data.email, password: data.password }, {
        onSuccess: (response) => {
          if (response?.success && response.data?.user && response.data?.accessToken) {
            action.resetForm();
            login(response.data.user, response.data.accessToken);
            userNavigate(response.data.user.role);
          } else {
            return
          }
        }
      })
    },
  });

  return (
    <div className="p-4 md:p-3 h-screen bg-slate-50 flex items-center justify-center font-sans overflow-hidden">
      <div className="w-full h-full max-w-[1440px] bg-white lg:rounded-3xl lg:shadow-xl lg:shadow-slate-200/50 lg:border lg:border-slate-100 overflow-hidden flex">

        {/* --- LEFT SIDE: BRAND / ARTWORK PANEL (Hidden on Mobile) --- */}
        <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden">
          {/* Decorative Background Accents */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl -ml-20 -mb-20" />

          {/* Logo Match from Sidebar */}
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-between p-2 text-white shadow-sm">
              <div className="w-full h-full border-2 border-white rounded-md opacity-90 relative">
                <div className="absolute right-0 top-0 w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Wealthio</span>
          </div>

          {/* Core App Showcase Feature */}
          <div className="relative z-10 my-auto max-w-md space-y-4">
            <span className="text-xs font-semibold tracking-wider text-indigo-400 uppercase bg-indigo-950/50 px-3 py-1.5 rounded-lg border border-indigo-900/40">
              Enterprise Dashboard
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-white leading-tight">
              Manage your real estate listings & payments with ease.
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Optimize workflow processing, analyze performance data, and manage client subscriptions all under one secure layout.
            </p>
          </div>

          {/* Footer Branding Notes */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-500">
            <span>© 2026 Wealthio Inc.</span>
            <div className="flex gap-4">
              <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: FORM PANEL --- */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 lg:px-20 xl:px-24 py-12 relative bg-white overflow-y-auto lg:overflow-visible">

          {/* Mobile Logo Visibility */}
          <div className="flex items-center gap-3 lg:hidden mb-12 absolute top-8 left-6 sm:left-16">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-between p-2 text-white">
              <div className="w-full h-full border-2 border-white rounded-md opacity-90 relative">
                <div className="absolute right-0 top-0 w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">Wealthio</span>
          </div>

          {/* Header Block */}
          <div className="mb-8 mt-6 lg:mt-0">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
              Welcome back
            </h2>
            <p className="text-slate-400 text-sm mt-1.5">
              Please enter your operational credentials to log in.
            </p>
          </div>

          {/* Formik Form Container */}
          <form onSubmit={formik.handleSubmit} className="space-y-5">

            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-600 tracking-wide">
                Email Address
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Mail size={18} strokeWidth={1.5} />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-50/80 ${formik.touched.email && formik.errors.email
                    ? "border-red-300 focus:border-red-500 focus:ring-red-50"
                    : "border-slate-200 focus:border-indigo-600 focus:shadow-sm"
                    }`}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs font-medium text-red-500 mt-1 pl-1">
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-slate-600 tracking-wide">
                  Password
                </label>
                <a href="#forgot" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock size={18} strokeWidth={1.5} />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className={`w-full pl-11 pr-11 py-3 bg-white border rounded-xl text-sm transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-50/80 ${formik.touched.password && formik.errors.password
                    ? "border-red-300 focus:border-red-500 focus:ring-red-50"
                    : "border-slate-200 focus:border-indigo-600 focus:shadow-sm"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-xs font-medium text-red-500 mt-1 pl-1">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Remember Me Utility checkbox */}
            <div className="flex items-center">
              <label className="relative flex items-center cursor-pointer select-none text-slate-600">
                <input
                  type="checkbox"
                  name="rememberMe"
                  onChange={formik.handleChange}
                  checked={formik.values.rememberMe}
                  className="w-4 h-4 text-indigo-600 border-slate-200 rounded focus:ring-indigo-500 accent-indigo-600 transition-all cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-500 ml-2">
                  Keep me signed in for 30 days
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoggingUser}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-sm shadow-indigo-200/80 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              <span>{formik.isSubmitting ? "Signing in..." : "Sign In to Dashboard"}</span>
              {!formik.isSubmitting && (
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              )}
            </button>

            {/* --- NEW USER REGISTRATION LINK --- */}
            <p className="text-center text-xs text-slate-500 mt-4">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors focus:outline-none"
              >
                Sign up
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}