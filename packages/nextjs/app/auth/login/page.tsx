import type { Metadata } from "next"
import Link from "next/link"
import { LoginForm } from "~~/components/auth/login/login-form"

export const metadata: Metadata = {
    title: "Login",
    description: "Login to your account",
}

const Login = () => {
    return(
        <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 border p-5 rounded-lg bg-gray-900 shadow-lg shadow-gray-950">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-200">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-300">
              Or{" "}
              <Link href="/auth/register" className="font-medium text-gray-400 hover:text-gray-500">
                create a new account
              </Link>
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    );
};

export default Login