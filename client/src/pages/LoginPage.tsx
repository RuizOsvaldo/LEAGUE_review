export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e0f0ff]">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-md text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">LEAGUE Report</h1>
        <p className="text-sm text-slate-500 mb-8">Sign in with your Pike13 account to continue</p>
        <a
          href="/api/auth/pike13"
          className="inline-block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          Sign in with Pike13
        </a>
      </div>
    </div>
  )
}
