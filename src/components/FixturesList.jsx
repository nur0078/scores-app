import { fixtures } from "../constants";

const FixturesList = () => {
  return (
    <div className="">
      <ul role="list" className="divide-y divide-gray-100  ">
        <div className="">
          {fixtures.map((game) => (
            <li
              key={game.home}
              className="p-4 justify-between  border-2 border-slate-400 rounded-lg my-3 "
            >
              {/* Single Stacks Div */}
              <div id="single-stack" className="flex">
                {/* Home Team */}
                <div className="items-center flex gap-2">
                  {/* Home team logo */}
                  <img
                    id="homeLogo"
                    className="h-8 w-8 flex rounded-full bg-gray-50 "
                    src={game.homeLogo}
                    alt="home team logo"
                  />
                  {/* Home team name */}
                  <h2 className=""> {game.home}</h2>
                </div>
                
                {/* Game INFO  */}
                <div className="min-w-0 flex-auto ">
                  {/* Kick-off Time */}
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {game.kickOff}
                  </p>
                  {/* Stadium */}
                  <p className=" text-xs leading-5 text-gray-500">
                    {game.stadium}
                  </p>
                </div>

                {/* Away TEAM */}
                {/* Away team logo */}
                <div className="items-center flex gap-x-2">
                  {/* Home team name */}
                  <h2 className=""> {game.away}</h2>

                  {/* Home team logo */}
                  <img
                    id="homeLogo"
                    className="h-8 w-8 flex-none rounded-full bg-gray-50 "
                    src={game.awayLogo}
                    alt="home team logo"
                  />
                </div>
              </div>
              <div></div>
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
};

export default FixturesList;
