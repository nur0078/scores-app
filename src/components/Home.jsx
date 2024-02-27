import Billboard from "./Billboard"
import Standings from "./Standings"
import FixturesList from "./FixturesList"

const Home = () => {
  return (
    <div>
      <div id="home" className=" py-8 font-poppins md:h-lvh md:grid md:grid-cols-2 gap-10 justify-center items-center ">
        <div id="billboard" className="flex justify-center items-center">
            <Billboard />
        </div>
        <div id="fixtures" className="flex justify-center items-center  pb-14">
            <FixturesList />
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Standings />
      </div>
    </div>

  )
}

export default Home