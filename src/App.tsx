import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Interface/Components/Contexts/AuthContext";
import ErrorBoundary from "./Interface/Components/common/ErrorBoundary";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;