import { Routes, Route} from "react-router-dom";
import Homepage from "./pages/Homepage";
import Title from "./components/Title";
import SortPage from "./pages/SortPage";
import TreePage from "./pages/TreePage";
import GraphPage from "./pages/GraphPage";

function App() {

  return (
    <div className="flex flex-col w-full min-h-screen justify-between bg-slate-800 text-white font-light overflow-hidden">
      <Title />
      <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/sort" element={<SortPage />} />
          <Route path="/tree" element={<TreePage />} />
          <Route path="/graph" element={<GraphPage />} />
      </Routes>
      <div className="h-8 m-2 flex justify-center hover:underline text-s font-normal">
        <a href="https://github.com/jimmybowcott/algorithm-visualiser">© 2024 Jimmy Bowcott</a>
      </div>
    </div>
  )
}

export default App
