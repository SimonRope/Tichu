import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./pages/Game";
import NewGame from "./pages/NewGame";
import AddNewPlayer from "./pages/AddNewPlayer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<NewGame />} path="/" />
        <Route element={<Game />} path="/game" />
        <Route element={<AddNewPlayer />} path="/addNewPlayer" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
