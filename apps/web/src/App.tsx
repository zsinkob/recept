import React, { useContext } from 'react'
import { AuthProvider, AuthContext } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import RecipeList from './pages/RecipeList'
import RecipeDetails from './pages/RecipeDetails'
import NewRecipe from './pages/NewRecipe'
import ScrapeRecipe from './pages/ScrapeRecipe'
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'

function AppContent() {
  const { token, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="max-w-3xl mx-auto flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold"><Link to="/">Recept</Link></h1>
        <nav className="flex gap-4 items-center">
          {token ? (
            <>
              <Link to="/" className="text-gray-700 hover:text-gray-900">Recipes</Link>
              <Link to="/new" className="text-gray-700 hover:text-gray-900">New Recipe</Link>
              <Link to="/scrape" className="text-gray-700 hover:text-gray-900">Scrape</Link>
              <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-gray-900">Login</Link>
              <Link to="/register" className="text-gray-700 hover:text-gray-900">Register</Link>
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
          <Route path="/new" element={token ? <NewRecipe/> : <Navigate to="/login" replace />} />
          <Route path="/scrape" element={token ? <ScrapeRecipe/> : <Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}
