import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { persistor, store } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Auth0Provider } from "@auth0/auth0-react";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
       domain="dev-03e23ibtmzyhvro4.us.auth0.com"
      clientId="OxxfhJM7dXbNicTqcgOJE3d0ElGCbjdI"
      authorizationParams={{
      redirect_uri: window.location.origin
    }}
    >
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
      ,
    </Auth0Provider>
  </StrictMode>
);
