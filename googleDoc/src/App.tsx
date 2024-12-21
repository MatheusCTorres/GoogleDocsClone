import { useEffect, useState } from "react";
import "./App.css";
import "./Btn.css";
import { auth } from "./firebase-config";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { TextEditor } from "./components/text-editor";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    signInAnonymously(auth);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(`User signed in: `, user.uid);
      }
    });
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div className="app">
      <header>
        <h1>Google Docs</h1>
      </header>
      <TextEditor />
      {/* <button onClick={toggleDarkMode} className="btn">
        Switch to {darkMode ? "Light" : "Dark"} Mode
      </button> */}
      <div className="buttons-container">
        <button onClick={toggleDarkMode} className="button-arounder">
          {darkMode ? "Light" : "Dark"} Mode
        </button>
      </div>
    </div>
  );
}

export default App;
