import React, { useContext } from 'react'
import { AuthProvider, AuthContext } from './contexts/AuthContext'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import Login from './pages/Login'
import Register from './pages/Register'
import RecipeList from './pages/RecipeList'
import RecipeDetails from './pages/RecipeDetails'
import NewRecipe from './pages/NewRecipe'
import EditRecipe from './pages/EditRecipe'
import ScrapeRecipe from './pages/ScrapeRecipe'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'

function AppContent() {
  const { token, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors">
      <header className="max-w-3xl mx-auto flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100"><Link to="/">Recept</Link></h1>
        <nav className="flex gap-4 items-center">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title={theme === 'dark' ? 'Világos téma' : 'Sötét téma'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {token ? (
            <>
              <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">Receptek</Link>
              <Link to="/new" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">Új recept</Link>
              <Link to="/scrape" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">Importálás</Link>
              <button onClick={logout} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">Kijelentkezés</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">Bejelentkezés</Link>
              <Link to="/register" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">Regisztráció</Link>
            </>
          )}
        </nav>
      </header>
      <main className="max-w-3xl mx-auto">
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/" element={token ? <RecipeList/> : <Navigate to="/login" replace />} />
          <Route path="/recipes/:id" element={token ? <RecipeDetails/> : <Navigate to="/login" replace />} />
          <Route path="/recipes/:id/edit" element={token ? <EditRecipe/> : <Navigate to="/login" replace />} />
          <Route path="/new" element={token ? <NewRecipe/> : <Navigate to="/login" replace />} />
          <Route path="/scrape" element={token ? <ScrapeRecipe/> : <Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
