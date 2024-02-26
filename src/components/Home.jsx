import Billboard from "./Billboard"
import FixturesList from "./FixturesList"

const Home = () => {
  return (
    <div id="home" className="px-1 font-poppins">
        <div id="billboard" className="mb-6">
            <Billboard />
        </div>
        <div id="fixtures" className="">
            <FixturesList />
        </div>
    </div>
  )
}

export default Home