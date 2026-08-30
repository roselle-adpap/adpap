import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="section flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-6xl font-semibold text-navy-950">404</p>
      <h1 className="mt-3 text-xl font-semibold text-navy-900">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-navy-700/60">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Return Home
      </Link>
    </div>
  );
}
