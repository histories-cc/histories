import { KBarAnimator, KBarPortal, KBarPositioner,  KBarSearch, useMatches } from "kbar"
import React from "react"
import KBarResults from "./KBarResults"

const KBar: React.FC = () => {
    return (<KBarPortal> <KBarPositioner>
        <KBarAnimator>
            <KBarSearch />
            <KBarResults />
        </KBarAnimator>
    </KBarPositioner>
    </KBarPortal>)
}



export default KBar


