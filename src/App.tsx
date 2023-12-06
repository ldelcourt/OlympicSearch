import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Athlete from "./pages/athlete/athlete";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/athlete/:name" Component={Athlete} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
