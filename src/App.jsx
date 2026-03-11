import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./pages/Game";
import NewGame from "./pages/NewGame";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NewGame />} path="/" />
        <Route element={<Game />} path="/game" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
