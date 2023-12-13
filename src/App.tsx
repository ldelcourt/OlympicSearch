import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Sport from './pages/Sport/sport';
import Athlete from "./pages/athlete/athlete";
import Edition from "./pages/edition/edition";
import Header from "./Component/Header";


function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/Sport/sport" element={<Sport/>}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/edition/:edition" element={<Edition/>}></Route>
        <Route path="/athlete/:name" Component={Athlete} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
