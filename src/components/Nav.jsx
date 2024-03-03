import footballLogo from "../assets/logo/footballLogo.svg";

const Nav = () => {
  return (
    <div className="flex text-2xl text-center justify-center mb-6 underline hover:no-underline">
      {/* TITLE */}
      <h1 className="text-4xl "> scores </h1>
      {/* FootballLogo */}
      <img src={footballLogo} alt="football logo" className="h-8 w-8 " />
    </div>
  );
};

export default Nav;
