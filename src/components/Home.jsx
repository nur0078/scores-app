import Billboard from "./Billboard"
import Standings from "./Standings"
import FixturesList from "./FixturesList"

const Home = () => {
  return (
    <div>
      <div id="home" className=" p-6  font-poppins md:h-lvh md:grid md:grid-cols-2 gap-10 justify-center items-center ">
        <div id="billboard" className="w-[400px] pb-16 pr-16 md:pr-20 lg:w-[600px]  mx-auto">
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