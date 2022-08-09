import { KBarResults, useMatches } from "kbar";
import React from "react"
import actions from "../../../constants/actions"

const Results:React.FC = () => {
    const { results } = useMatches();
  
    return (
      <div className="rounded-b-[8px] bg-white py-1 px-1">
      <KBarResults
        items={results}
        onRender={({ item, active }) =>
          typeof item === "string" ? (
            <div>{item}</div>
          ) : (
            <div
          className={`flex gap-2 hover:bg-brand hover:text-white rounded-[8px] bg-transparent py-3 px-6 font-semibold`}
            >
              {item.icon} {item.name}
            </div>
          )
        }
      />
      </div>
    );
  }

  export default Results