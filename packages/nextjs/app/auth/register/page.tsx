import type { Metadata } from "next"
import Link from "next/link"
import { RegistrationForm } from "~~/components/auth/register/register-form"

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account",
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 ">
      <div className="w-full max-w-md space-y-8 border p-5 rounded-lg bg-gray-900 shadow-lg shadow-gray-950">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-200">Create an account</h2>
          <p className="mt-2 text-sm text-gray-300">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-gray-400 hover:text-gray-500">
              Sign in
            </Link>
          </p>
        </div>
        <RegistrationForm />
      </div>
    </div>
  )
}
