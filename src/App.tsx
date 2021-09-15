import React, { useEffect } from "react";
import "./App.css";

function App() {
  const connect = () => {};

  useEffect(() => {
    connect();
  }, []);

  return (
    <div className="App">
      <h1>welcome to tic-tac-toe game</h1>
    </div>
  );
}

export default App;
