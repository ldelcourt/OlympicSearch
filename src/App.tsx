import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Athlete from "./pages/athlete/athlete";

import Edition from "./pages/edition/edition";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/edition/:edition" element={<Edition/>}></Route>
        <Route path="/athlete/:name" Component={Athlete} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
