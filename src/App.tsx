import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Sport from './pages/sport';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Home />}></Route> */}
        <Route path="/sport" element={<Sport/>}></Route>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
