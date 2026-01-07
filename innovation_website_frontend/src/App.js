import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import "./App.css";
import { InnovationsProvider } from "./context/InnovationsContext";
import { HomePage } from "./pages/HomePage";
import { FavoritesPage } from "./pages/FavoritesPage";

// PUBLIC_INTERFACE
function App() {
  /** App shell with header navigation and routed pages. */
  return (
    <InnovationsProvider>
      <a className="skipLink" href="#main">
        Skip to content
      </a>

      <div className="app">
        <header className="header">
          <div className="container headerInner">
            <a className="brand" href="/" aria-label="Innovation Showcase home">
              <div className="brandMark" aria-hidden="true" />
              <div className="brandText">
                <div className="brandTitle">Innovation Showcase</div>
                <div className="brandSub">Ocean Professional</div>
              </div>
            </a>

            <nav className="nav" aria-label="Primary navigation">
              <NavLink to="/" end>
                Home
              </NavLink>
              <NavLink to="/favorites">Favorites</NavLink>
            </nav>

            <div className="headerActions">
              <span className="badge" title="Data source">
                <span className="badgeDot" style={{ background: "#2563eb" }} />
                Mock JSON
              </span>
            </div>
          </div>
        </header>

        <main id="main" className="main">
          <div className="container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </div>
        </main>

        <footer className="footer">
          <div className="container">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "space-between" }}>
              <span>© {new Date().getFullYear()} Innovation Showcase</span>
              <span>
                Data stored locally in your browser (localStorage). Refresh-safe, no backend required.
              </span>
            </div>
          </div>
        </footer>
      </div>
    </InnovationsProvider>
  );
}

export default App;
