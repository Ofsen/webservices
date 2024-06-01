import { RouterProvider } from "react-router-dom";
import AuthProvider from "@/lib/contexts/AuthContext";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import router from "./config/routes";

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Suspense fallback={<p>Loading...</p>}>
          <RouterProvider router={router} />
        </Suspense>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
