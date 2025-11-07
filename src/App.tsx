import './App.css';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { AppRouter } from './app/routes/AppRouter';

function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
