
const actions = [
    {
        id:"home",
        name:"Home",
        shortcut:["h"],
        keywords:"home map default",
        perform: () => (window.location.pathname = "/"),
    },{
        id:"about",
        name:"About",
        shortcut:["a"],
        keywords:"about",
        perform: () => (window.location.pathname = "/about"),
    },{
        id:"github",
        name:"Github",
        shortcut:["g"],
        keywords:"github source code",
        perform: () => (window.location.pathname = "https://github.com/histories/histories"),
    }
]

export default actions