'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useRegister } from '@/providers/auth-provider';
import { registerSchema, type RegisterFormData } from '@/lib/validators';
import { FormField } from '@/components/form-field';
import { useRateLimit } from '@/hooks/use-rate-limit';
import { Button, Alert } from '@/components/ui';
import type { ApiError } from '@/types';
import { AxiosError } from 'axios';
import { User, Mail, Lock, Phone, AlertCircle, ArrowRight, Eye, EyeOff, CheckCircle2, UserCircle } from 'lucide-react';

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.10z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { cooldown, isLimited, checkRateLimit } = useRateLimit();

  const {
    register: reg,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const registerUser = useRegister();

  async function onSubmit(data: RegisterFormData) {
    setServerError(null);
    try {
      const tokens = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || undefined,
      });
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          role: 'user',
        }),
      });
      window.location.href = '/';
    } catch (err) {
      if (checkRateLimit(err)) return;
      if (err instanceof AxiosError) {
        const apiErr = err.response?.data as ApiError | undefined;
        const msg = apiErr?.message;
        setServerError(
          Array.isArray(msg) ? msg.join(', ') : msg || 'Kayıt başarısız.',
        );
      } else {
        setServerError('Kayıt başarısız.');
      }
    }
  }

  function handleGoogleRegister() {
    const googleUrl = `${window.location.origin}/api/v1/auth/google?returnTo=${encodeURIComponent('/')}`;
    window.location.href = googleUrl;
  }

  return (
    <div className="min-h-screen flex">
      
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 relative overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl font-black">NT</span>
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold">NetTapu</h2>
                <p className="text-blue-100 text-sm">Arsa & Açık Artırma</p>
              </div>
            </div>

            <h1 className="text-4xl font-heading font-extrabold tracking-tight mb-4">
              Ücretsiz Üye Olun,<br />Fırsatları Kaçırmayın
            </h1>
            <p className="text-xl text-blue-100 mb-12 leading-relaxed">
              Binlerce doğrulanmış arsa ve canlı açık artırmalara anında erişim kazanın.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              {[
                'Özel fırsatlara erken erişim',
                'Canlı ihalelere katılım hakkı',
                'Detaylı arsa raporları',
                'Profesyonel danışmanlık',
              ].map((benefit, i) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="h-6 w-6 text-blue-300" />
                  <span className="text-blue-50">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md py-8"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 mb-4 shadow-lg shadow-blue-500/30">
              <span className="text-2xl font-black text-white">NT</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-heading font-extrabold text-slate-900 mb-2">
                Hesap Oluşturun
              </h1>
              <p className="text-slate-600">
                Hemen ücretsiz üye olun, ihalelere katılın
              </p>
            </div>

            {/* Server Error */}
            {serverError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <span className="ml-2">{serverError}</span>
              </Alert>
            )}

            {/* Rate Limit Warning */}
            {isLimited && (
              <Alert variant="warning" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <span className="ml-2">
                  Çok fazla deneme yaptınız. {cooldown} saniye sonra tekrar deneyin.
                </span>
              </Alert>
            )}

            {/* Google Register Button */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm mb-6"
            >
              <GoogleIcon />
              Google ile Kaydol
            </button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500 font-medium">veya e-posta ile</span>
              </div>
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-slate-700 mb-2">
                  Kullanıcı Adı
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    {...reg('username')}
                    type="text"
                    id="username"
                    placeholder="kullaniciadi"
                    className={`w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.username ? 'border-red-300 focus:ring-red-500' : 'border-slate-200'
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.username && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Name Fields (2 columns) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-2">
                    Ad
                  </label>
                  <input
                    {...reg('firstName')}
                    type="text"
                    id="firstName"
                    placeholder="Ad"
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.firstName ? 'border-red-300 focus:ring-red-500' : 'border-slate-200'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-2">
                    Soyad
                  </label>
                  <input
                    {...reg('lastName')}
                    type="text"
                    id="lastName"
                    placeholder="Soyad"
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.lastName ? 'border-red-300 focus:ring-red-500' : 'border-slate-200'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    {...reg('email')}
                    type="email"
                    id="email"
                    placeholder="ornek@email.com"
                    className={`w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.email ? 'border-red-300 focus:ring-red-500' : 'border-slate-200'
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone (Optional) */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                  Telefon <span className="text-slate-400 font-normal">(Opsiyonel)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    {...reg('phone')}
                    type="tel"
                    id="phone"
                    placeholder="0555 123 45 67"
                    className={`w-full pl-12 pr-4 py-3 bg-slate-50 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-slate-200'
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    {...reg('password')}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="En az 8 karakter"
                    className={`w-full pl-12 pr-12 py-3 bg-slate-50 border rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.password ? 'border-red-300 focus:ring-red-500' : 'border-slate-200'
                    }`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isLimited}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 btn-shine"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Hesap Oluşturuluyor...
                  </>
                ) : (
                  <>
                    Ücretsiz Kaydol
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              {/* Terms */}
              <p className="text-xs text-center text-slate-500 leading-relaxed">
                Kaydolarak{' '}
                <Link href="/legal" className="text-blue-600 hover:underline">
                  Kullanım Koşulları
                </Link>{' '}
                ve{' '}
                <Link href="/legal" className="text-blue-600 hover:underline">
                  Gizlilik Politikası
                </Link>
                'nı kabul etmiş olursunuz.
              </p>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-slate-600">
                Zaten hesabınız var mı?{' '}
                <Link
                  href="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Giriş Yapın
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
