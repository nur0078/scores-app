import Billboard from "./Billboard"
import FixturesList from "./FixturesList"

const Home = () => {
  return (
    <div id="home" className="px-4">
        <div id="billboard">
            <Billboard />
        </div>
        <div id="fixtures" className="px-6">
            <FixturesList />
        </div>
    </div>
  )
}

export default Home