import { Component } from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-xl px-4 py-16 text-center">
          <h2 className="text-2xl font-extrabold text-slate-900">Something went wrong</h2>
          <p className="mt-2 text-sm text-slate-500">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white"
            >
              Try again
            </button>
            <Link to="/" className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700">
              Go home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
