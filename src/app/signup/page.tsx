import { SignupForm } from "../../components/forms/SignupForm"

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  )
}
