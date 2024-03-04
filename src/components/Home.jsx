import Billboard from "./Billboard";
import Standings from "./Standings";
import FixturesList from "./FixturesList";
import Nav from "./Nav";

// Home component renders the main dashboard layout
const Home = () => {
  return (
    <div className="py-8 font-poppins p-8">
      {/* Main grid layout for desktop and mobile */}
      {/* <div className="h-screen "> */}
      {/* NAVBAR */}
      <Nav />
      <div
        id="home"
        className=" md:grid md:grid-cols-2 justify-center items-center"
      >
        {/* Billboard section */}
        <div id="billboard" className="flex justify-center items-center">
          <Billboard />
        </div>
        {/* Fixtures section */}
        <div id="fixtures" className="m-2 ">
          <FixturesList />
        </div>
      </div>
      {/* </div> */}
      {/* Standings section */}
      <div className="flex justify-center items-center mt-10 h-screen">
        <Standings />
      </div>
    </div>
  );
};

export default Home;
