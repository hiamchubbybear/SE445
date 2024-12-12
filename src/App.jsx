import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Login />
      </div>
    </AuthProvider>
  );
}
export default App;