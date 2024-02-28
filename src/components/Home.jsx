import Billboard from "./Billboard";
import Standings from "./Standings";
import FixturesList from "./FixturesList";

// Home component renders the main dashboard layout
const Home = () => {
  return (
    <div className="py-8 font-poppins">
      {/* Main grid layout for desktop and mobile */}
      <div id="home" className="md:grid md:grid-cols-2 justify-center items-center">
        {/* Billboard section */}
        <div id="billboard" className="flex justify-center items-center">
          <Billboard />
        </div>
        {/* Fixtures section */}
        <div id="fixtures" className="m-2 pt-8">
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
