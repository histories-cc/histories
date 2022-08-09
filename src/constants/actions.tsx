import { MapIcon, CodeIcon, CogIcon, LoginIcon, LogoutIcon, PlusCircleIcon, BookOpenIcon } from "@heroicons/react/outline"
import { Action } from "kbar"

const actions:Action[] = [
    {
        id: "map",
        name: "Map", 
        keywords: "home map default",
        icon: <MapIcon className="w-5" />,
        perform: () => (window.location.pathname = "/"),
    }, {
        id: "about",
        name: "About", 
        keywords: "about",
        icon: <BookOpenIcon className="w-5" />,
        perform: () => (window.location.pathname = "/about"),
    }, {
        id: "settings",
        name: "Settings",
        shortcut: ["s"],
        keywords: "settings configure",
        icon: <CogIcon className="w-5" />,
        perform: () => (window.location.pathname = "/settings"),
    }, {
        id: "github",
        name: "Github", 
        keywords: "github source code",
        icon: <CodeIcon className="w-5" />,
        // @ts-ignore
        perform: () => (window.location = "https://github.com/histories-cc/histories"),
    }
]

export const notLoggedActions:Action[] = [
    {
        id: "login",
        name: "Login",
        shortcut: ["l"],
        keywords: "login signin",
        icon: <LoginIcon className="w-5" />,
        perform: () => (window.location.pathname = "/login"),
    },{
        id: "register",
        name: "Register", 
        keywords: "register signup", 
        icon: <PlusCircleIcon className="w-5" />,
        perform: () => (window.location.pathname = "/register"),
    }
]



export const loggedActions:Action[] = [
    {
        id: "logout",
        name: "Log out", 
        keywords: "logout signout",
        icon: <LogoutIcon className="w-5" />,
        perform: () => (window.location.pathname = "/logout"),
    },
    {
        id: "createpost",
        name: "Create post", 
        keywords: "create post createpost", 
        icon: <PlusCircleIcon className="w-5" />,
        perform: () => (window.location.pathname = "/create-post"),
    }
]

export default actions