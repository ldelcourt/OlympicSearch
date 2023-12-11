import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Sport from './pages/sport';
import Header from "./Component/Header";


function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>

        <Route path="/" element={<Home />}></Route>
        <Route path="/sport" element={<Sport/>}></Route>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
