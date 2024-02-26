
const Billboard = () => {
  return (
    <div className="m-2 p-2 border-4 border-red-600 rounded-3xl">
        {/*============ Top Bins ============ */}
        <div className="flex-col text-left">
        {/* =========== League and Week Info =========== */}
            <div id="leagueName" className="flex justify-around">
                <div>
                    <span>
                        Logo  | League Name 
                    </span>
                    <small className="m-auto flex">Week 11</small>
                </div>
                
                <span>
                    Live Status 
                </span>
            </div>
            {/* ========== GameWeek ========== */}
            
        </div>

        {/* SCOREBOARD */}
        <div>
            Logo Score (vs) Score Logo & name
        </div>
        <div>
            Game Time
        </div>
        <div>
            Team Name Stadium Team Name
        </div>

    </div>
  )
}

export default Billboard