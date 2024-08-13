import { Routes, Route} from "react-router-dom";
import Homepage from "./pages/Homepage";
import Title from "./components/Title";
function App() {

  return (
    <div className="flex flex-col w-full h-screen items-center justify-between bg-white text-slate-800 dark:bg-slate-800 dark:text-white font-light">
      <div className="h-auto">
      <Title />
      </div>
      <Routes>
          <Route path="/" element={<Homepage />} />
      </Routes>
      <div className="h-8 m-2 flex justify-center hover:underline text-s font-normal">
        <a href="https://github.com/jimmybowcott/algorithm-visualiser">© 2024 Jimmy Bowcott</a>
      </div>
    </div>
  )
}

export default App
