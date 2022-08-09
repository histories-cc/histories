import actions, { loggedActions, notLoggedActions } from "@src/constants/actions"
import MeContext from "@src/contexts/MeContext"
import { KBarAnimator, KBarPortal, KBarPositioner, KBarSearch, useKBar, useMatches } from "kbar"
import React, { useContext, useEffect } from "react"
import KBarResults from "./KBarResults"
import { UserCircleIcon } from "@heroicons/react/outline"

const KBar: React.FC = () => {
    const kBarContext = useKBar()
    const { me } = useContext(MeContext)

    useEffect(() => {
        if (me == null) {
            kBarContext.query.registerActions(notLoggedActions)
            kBarContext.query.registerActions(loggedActions)()
        }
        else {
            kBarContext.query.registerActions([...loggedActions, {
                id: "me",
                name: "My profile",
                keywords: "user me login profile",
                icon: <UserCircleIcon className="w-5" />,
                perform: () => (window.location.pathname = `/u/${me.username}`),

            }])
            kBarContext.query.registerActions(notLoggedActions)()
        }
    }, [me])


    return (<KBarPortal >
        <KBarPositioner className="z-50 backdrop-blur-sm backdrop-brightness-75">
            <KBarAnimator>
                <div className="shadow-md rounded-[8px] bg-white">
                    <KBarSearch className="py-4 px-7 font-semibold rounded-t-[8px] border-b border-light focus:outline-none w-[500px]" />
                    <KBarResults />
                </div>
            </KBarAnimator>
        </KBarPositioner>
    </KBarPortal>
    )
}



export default KBar


