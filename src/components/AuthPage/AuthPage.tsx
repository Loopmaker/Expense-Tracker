import { useState } from 'react'
import './AuthPage.css'

interface AuthPageProps {
  onSignIn: (email: string, password: string) => Promise<void>
  onSignUp: (email: string, password: string) => Promise<void>
}

export function AuthPage({ onSignIn, onSignUp }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        await onSignIn(email, password)
      } else {
        await onSignUp(email, password)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Logo */}
        <div className="auth-logo">
          <div className="logo-box">S</div>
          <span className="logo-text">SpendLog</span>
        </div>

        <h2 className="auth-title">
          {isLogin ? 'Welcome back' : 'Create an account'}
        </h2>

        <p className="auth-subtitle">
          {isLogin
            ? 'Sign in to see your transactions.'
            : 'Start tracking your spending.'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading} className="auth-button">
            {loading
              ? 'Please wait…'
              : isLogin
              ? 'Sign in'
              : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin
            ? "Don't have an account? "
            : 'Already have an account? '}
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
            }}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}