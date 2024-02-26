import Home from "./components/Home"

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className=" text-center py-10">
    <h1 className="text-4xl font-bold pb-4" >Sports Scores </h1>
    {/* logos as hyperlinks */}
    <span> Logos for Latest | Football | Cricket | Others</span>

    <div id="home-billboard">
      <Home />
    </div>

    </div>
  )
}

export default App
