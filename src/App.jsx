import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./pages/Game";
import NewGame from "./pages/NewGame";
import AddNewPlayer from "./pages/AddNewPlayer";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NewGame />} path="/newGame" />
        <Route element={<Home />} path="/" />
        <Route element={<Game />} path="/game/:gameId" />
        <Route element={<AddNewPlayer />} path="/addNewPlayer" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
