//login elements
const login = document.querySelector(".login")
const loginForm = login.querySelector(".login__form")
const loginInput = login.querySelector(".login__input")

//chat elements
const chat = document.querySelector(".chat")
const chatForm = chat.querySelector(".chat__form")
const chatInput = chat.querySelector(".chat__input")
const chatMessage = chat.querySelector(".chat__messages")

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]
const user = {id: "", name:"", color:""}

let websocket

const createMessageSelf = (content)=>{
    const div = document.createElement("div")
    div.classList.add("message--self")
    div.innerHTML = content

    return div
}

const createMessageother = (content, sender, senderColor) =>{
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message--other")

    div.classList.add("message--self")
    span.classList.add("message--sender")
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender
    div.innerHTML += content
    return div
}

const getRandomColor = ()=>{
    const randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

const scrollScreen = ()=>{
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}

const processMessage = ({data}) =>{
    const {userId, userName, userColor, content} = JSON.parse(data)

    const message = userId == user.id ? 
    createMessageSelf(content): 
    createMessageother(content, userName, userColor)

    chatMessage.appendChild(message)

    scrollScreen()
}

const handleSubmit = (event) =>{
    event.preventDefault()
    user.id = crypto.randomUUID()
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("ws://localhost:8080") 
    websocket.onmessage = processMessage
    // websocket.onopen = ()=> websocket.send(`Usuário: ${user.name} entrou no chat!`)

    console.log(user)
}
 loginForm.addEventListener("submit", handleSubmit)

//parte da mensagem 

const sendMessage = (event) =>{
    event.preventDefault()
    const message = {
        userId: user.id,
        useName: user.name,
        userColor: user.color,
        content: chatInput.value
    }


    websocket.send(JSON.stringify(message))

    chatInput.value = ""
}

 chatForm.addEventListener("submit", sendMessage)





