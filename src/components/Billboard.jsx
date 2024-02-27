
const Billboard = () => {
  return (
    <div className="rounded-3xl bg-pale-blue shadow-2xl  h-[400px] lg:h-[500px]">
        {/*============ Top Bins ============ */}
        <div className="flex-col text-left py-4">
        {/* =========== League and Week Info =========== */}
            <div id="leagueName" className="flex justify-around">
                <div>
                    <span>
                        Logo  | League Name 
                    </span>
                    {/* ========== GameWeek ========== */}
                    <small className="m-auto flex">Week 11</small>
                </div>
                <span>
                    Live Status 
                </span>
            </div>

        </div>

        {/* SCOREBOARD */}
        <div className="py-3">
        <div className="text-center">
            Logo|name - Score (vs) Score - Logo|name
        </div>
        <div>
            Game Time
        </div>
        <div className="text-center py-3">
            Team Name Stadium Team Name
        </div>
        </div>

    </div>
  )
}

export default Billboard