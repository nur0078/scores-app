import Billboard from "./Billboard";
import Standings from "./Standings";
import FixturesList from "./FixturesList";

const Home = () => {
  return (
    <div className="py-8 font-poppins">
      {/* Main grid layout for desktop and mobile */}
      <div id="home" className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-center items-center">
        {/* Billboard section */}
        <div id="billboard" className="flex justify-center items-center">
          <Billboard />
        </div>
        {/* Fixtures section */}
        <div id="fixtures" className="flex justify-center items-center">
          <FixturesList />
        </div>
      </div>
      {/* Standings section */}
      <div className="flex justify-center items-center mt-10">
        <Standings />
      </div>
    </div>
  );
};

export default Home;
