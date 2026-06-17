import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { loadMovies, login, logout, store } from './store';
import './styles.css';

const demoMovies = [
  { id: 1, title: 'Побег из Шоушенка', overview: 'История о надежде и дружбе в тюрьме.', vote_average: 9.3 },
  { id: 2, title: 'Зелёная миля', overview: 'Драма о необычном заключённом и охранниках.', vote_average: 8.6 },
  { id: 3, title: 'Интерстеллар', overview: 'Путешествие к новым мирам ради спасения Земли.', vote_average: 8.7 },
];

function Header() {
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.auth.isAuth);

  return (
    <header className="header">
      <Link to="/" className="logo">MovieApp</Link>
      <nav>
        <Link to="/">Главная</Link>
        <Link to="/movies">Фильмы</Link>
        <Link to="/profile">Профиль</Link>
        {isAuth && <button onClick={() => dispatch(logout())}>Выйти</button>}
      </nav>
    </header>
  );
}

function HomePage() {
  return (
    <section className="card hero">
      <h1>Главная страница</h1>
      <p>Небольшое React + Redux приложение с авторизацией и списком фильмов.</p>
    </section>
  );
}

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ username: '', password: '' });

  useEffect(() => {
    if (isAuth) navigate('/profile');
  }, [isAuth, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(login(form));
  };

  return (
    <section className="card form-card">
      <h1>Вход</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Логин
          <input
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
            placeholder="Admin"
          />
        </label>
        <label>
          Пароль
          <input
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="12345"
            type="password"
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit">Войти</button>
      </form>
    </section>
  );
}

function MoviesPage() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.movies);
  const movies = items.length ? items : demoMovies;

  useEffect(() => {
    dispatch(loadMovies());
  }, [dispatch]);

  return (
    <section>
      <h1>Фильмы</h1>
      {loading && <p>Загрузка фильмов...</p>}
      {error && <p className="note">API TMDB недоступен без токена, поэтому показаны демо-фильмы.</p>}
      <div className="movies-grid">
        {movies.map((movie) => (
          <article className="card movie" key={movie.id}>
            <h2>{movie.title}</h2>
            <p>{movie.overview || 'Описание пока не добавлено.'}</p>
            <span>Рейтинг: {movie.vote_average}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProfilePage() {
  return (
    <section className="card">
      <h1>Профиль</h1>
      <p>Это закрытая страница с произвольным текстом. Она доступна только после входа.</p>
    </section>
  );
}

function PrivateRoute({ children }) {
  const isAuth = useSelector((state) => state.auth.isAuth);
  return isAuth ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
