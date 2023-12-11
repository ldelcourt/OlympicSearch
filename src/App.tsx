import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Athlete from "./pages/athlete/athlete";
import Sport from "./pages/sport/sport";

import Edition from "./pages/edition/edition";
import Header from "./Component/Header";


function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/edition/:edition" element={<Edition/>}></Route>
        <Route path="/athlete/:name" Component={Athlete} />
        <Route path="/sport/:name" Component={Sport} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
