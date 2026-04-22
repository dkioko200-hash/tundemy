import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex flex-col w-1.5 h-8 rounded-sm overflow-hidden">
              <div className="flex-1 bg-black" />
              <div className="flex-1 bg-[#bb0000]" />
              <div className="flex-1 bg-[#2d8a4e]" />
            </div>
            <span className="text-2xl font-bold" style={{ color: "#0f1f3d" }}>
              Skil<span style={{ color: "#2d8a4e" }}>ara</span>
            </span>
          </Link>
          <h1 className="mt-6 text-xl font-bold" style={{ color: "#0f1f3d" }}>
            Create your account
          </h1>
          <p className="mt-1 text-sm text-gray-500">Start learning AI skills today — free</p>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#0f1f3d" }}>
                First name
              </label>
              <input
                type="text"
                placeholder="Jane"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#2d8a4e] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#0f1f3d" }}>
                Last name
              </label>
              <input
                type="text"
                placeholder="Wanjiku"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#2d8a4e] transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#0f1f3d" }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#2d8a4e] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: "#0f1f3d" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Choose a strong password"
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#2d8a4e] transition-colors"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3.5 text-sm font-bold text-white rounded-xl transition-all hover:opacity-90"
            style={{ backgroundColor: "#2d8a4e" }}
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold" style={{ color: "#2d8a4e" }}>
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
