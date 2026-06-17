import { configureStore, createSlice } from '@reduxjs/toolkit';

const TMDB_API_KEY = '0ebb43b7b255b6e025f5b8f94aa2b793';
const savedAuth = localStorage.getItem('isAuth') === 'true';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuth: savedAuth,
    error: '',
  },
  reducers: {
    login(state, action) {
      const { username, password } = action.payload;

      if (username === 'Admin' && password === '12345') {
        state.isAuth = true;
        state.error = '';
        localStorage.setItem('isAuth', 'true');
      } else {
        state.isAuth = false;
        state.error = 'Имя пользователя или пароль введены не верно';
        localStorage.setItem('isAuth', 'false');
      }
    },
    logout(state) {
      state.isAuth = false;
      state.error = '';
      localStorage.setItem('isAuth', 'false');
    },
  },
});

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    items: [],
    loading: false,
    error: '',
  },
  reducers: {
    setMovies(state, action) {
      state.items = action.payload;
      state.loading = false;
      state.error = '';
    },
    setMoviesLoading(state) {
      state.loading = true;
      state.error = '';
    },
    setMoviesError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { login, logout } = authSlice.actions;
export const { setMovies, setMoviesLoading, setMoviesError } = moviesSlice.actions;

export const loadMovies = () => async (dispatch) => {
  dispatch(setMoviesLoading());

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=ru-RU`,
    );

    if (!response.ok) {
      throw new Error('Не удалось загрузить фильмы');
    }

    const data = await response.json();
    dispatch(setMovies(data.results || []));
  } catch (error) {
    dispatch(setMoviesError(error.message));
  }
};

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    movies: moviesSlice.reducer,
  },
});
