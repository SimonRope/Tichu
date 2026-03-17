import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import BambooBox from "../components/BambooBox";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("useEffect triggert");
    const lastGameId = localStorage.getItem("lastGameId");

    const alreadyRedirected = sessionStorage.getItem("didRedirect");

    if (lastGameId && !alreadyRedirected) {
        //wenn man auf der Home site startet, wird man automatisch weiter zum letzten spiel geleitet
      sessionStorage.setItem("didRedirect", "true");
      navigate(`/game/${lastGameId}`);
    }
  }, []);

  return (
    <div>
      <BambooBox>
        <Navbar />
        <h2>Home</h2>
      </BambooBox>
    </div>
  );
}

export default Home;
