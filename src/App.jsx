import {BrowserRouter, Routes, Route} from "react-router-dom"
import Game from "./pages/Game";
import Home from "./pages/NewGame";

function App() {

  return <BrowserRouter>
    <Routes>
      <Route element={<Home/>} path="/"/>
      <Route element ={<Game/>} path="/game"/>
    </Routes>
  </BrowserRouter>;
};

export default App;