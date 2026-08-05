import { Search, Home, ArrowRight } from 'lucide-react'
// Swap these <a> tags for <Link to="..."> from 'react-router-dom' in your app
// import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-white">
      {/* Header */}
      <div className="flex w-full items-center gap-4 px-6 py-8 md:px-12">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Gig<span className="text-fiver-green">Bro</span>
        </h1>
        <div className="h-6 w-px bg-gray-200" />
        <p className="text-sm text-gray-500">Smarter Gigs. Better Results.</p>
      </div>

      {/* Center content */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
        {/* Decorative shapes */}
        <span className="absolute left-[10%] top-[38%] h-3 w-3 rounded-full border-2 border-emerald-300" />
        <span className="absolute right-[14%] top-[14%] h-2.5 w-2.5 rounded-full border-2 border-emerald-300" />
        <span className="absolute left-[26%] top-[18%] text-xl font-light text-emerald-300">+</span>
        <span className="absolute right-[22%] top-[36%] text-lg font-light text-emerald-200">+</span>
        <span className="absolute right-[16%] top-[46%] text-lg font-light text-emerald-300">+</span>

        {/* 404 with glow */}
        <div className="relative">
          <span className="absolute inset-0 -z-10 scale-110 blur-2xl bg-emerald-300/30 rounded-full" />
          <h2 className="text-8xl font-extrabold tracking-tight text-emerald-500 sm:text-9xl">
            404
          </h2>
        </div>

        <h3 className="mt-6 text-2xl font-bold text-gray-900 sm:text-4xl">
          Oops! This page doesn&apos;t exist.
        </h3>
        <p className="mt-4 max-w-md text-gray-500 sm:text-lg">
          Looks like you took a wrong turn. Don&apos;t worry, it happens!
        </p>

        {/* Illustration */}
        <div className="relative mt-10 flex h-28 w-28 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-50" />
          <Search className="relative h-16 w-16 text-emerald-500" strokeWidth={2.5} />
          <span className="absolute right-2 top-1 text-emerald-500">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 4L8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M4 10L7 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M10 4L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </div>

        {/* Actions */}
        <a
          href="/dashboard"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-3 text-base font-semibold text-white shadow-sm shadow-emerald-200 transition hover:bg-emerald-600"
        >
          <Home className="h-5 w-5" />
          Back to Dashboard
        </a>

        <a
          href="/"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          Go to Home
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}

export default NotFound