import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { AppRouter } from './app/routes/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
