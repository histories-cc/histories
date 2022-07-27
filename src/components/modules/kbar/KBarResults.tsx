import { KBarResults, useMatches } from "kbar";
import React from "react"


const Results:React.FC = () => {
    const { results } = useMatches();
  
    return (
      <KBarResults
        items={results}
        onRender={({ item, active }) =>
          typeof item === "string" ? (
            <div>{item}</div>
          ) : (
            <div
              style={{
                background: active ? "#eee" : "transparent",
              }}
            >
              {item.name}
            </div>
          )
        }
      />
    );
  }

  export default Results