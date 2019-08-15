//Global Variables
const quoteList = document.getElementById("quote-list")
const quoteURL = `http://localhost:3000/quotes?_embed=likes`
const newForm = document.getElementById("new-quote-form")
const postURL = "http://localhost:3000/quotes"
const likeURL = "http://localhost:3000/likes"

//Event Listeners
newForm.addEventListener("submit", () => postNew(event))

//CREATE
const createCard = (quote)=>{
    let li = document.createElement("li")
    li.className = 'quote-card'
    li.id = `quote${quote.id}`
    
    li.innerHTML = `<blockquote class="blockquote">
                        <p class="mb-0">${quote.quote}</p>
                        <footer class="blockquote-footer">${quote.author}</footer>
                        <br>
                        <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
                        <button class='btn-danger'>Delete</button>
                    </blockquote>`
    let likeButton = li.getElementsByClassName("btn-success")[0]
    let deleteButton = li.getElementsByClassName("btn-danger")[0]
    likeButton.addEventListener("click", ()=> addLike(event, quote))
    deleteButton.addEventListener("click", ()=> deleteQuote(event, quote.id))
    quoteList.appendChild(li)
}

const postNew = (event)=>{
    event.preventDefault()
    let quote = document.getElementById("new-quote")
    let author = document.getElementById("author")
    fetch(postURL,{
        method: "POST",
        headers: {
            "content-type": "application/json",
            "accept": "application/json"
        },
        body:JSON.stringify({
            quote: quote.value,
            author: author.value,
            likes: []
        })
    })
    .then(res => res.json())
    .then(createCard, quote.value = "",  author.value = "")
    .catch(alert)  
}

const addLike = (event, quote) => {
    let span = event.target.querySelector("span")
    let spanNum = Number(span.innerHTML)
    
    fetch(likeURL,{
        method: "POST",
        headers:{
            "content-type": "application/json",
            "accept":"application/json"
        },
        body:JSON.stringify({
            quoteId: quote.id
        })
    })
    .then(res => res.json())
    .then( span.innerHTML = ++spanNum)
}

//READ
const fetchQuotes = () => {
    fetch(quoteURL)
        .then(res => res.json())
        .then(quotes => {
            quotes.forEach(createCard)
        })
}




//DELETE
const deleteQuote = (event, id) => {
    // let card = event.target.parentNode.parentNode
    let card = document.getElementById(`quote${id}`)
    fetch(`${postURL}/${id}`,{
        method: "DELETE"
    })
    .then(card.remove())
}


//FUNCTION CALLS
fetchQuotes()
