//GLOBAL VARIABLES
const quoteContainer = document.getElementById("quote-list")
const newForm = document.getElementById("new-quote-form")
const quoteUrl = "http://localhost:3000/quotes?_embed=likes"
const postUrl = "http://localhost:3000/quotes"
const likeUrl = "http://localhost:3000/likes"

//EVENT LISTENERS
newForm.addEventListener("submit", () => postNew(event))

//CREATE
const createQuote = (quote) => {
    let li = document.createElement("li")
    li.className = "quote-card"
    li.id = `quote ${quote.id}`
    li.innerHTML = `
    <blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
    <button class='btn-danger'>Delete</button>
    </blockquote>`
    let likeButton = li.getElementsByClassName("btn-success")[0]
    let deleteButton = li.getElementsByClassName("btn-danger")[0]
    likeButton.addEventListener("click", () => addLike(event, quote))
    deleteButton.addEventListener("click", () => deleteQuote(event, quote.id))
    quoteContainer.appendChild(li)
}

const postNew = (event) => {
    event.preventDefault()
    let quote = document.getElementById("new-quote")
    let author = document.getElementById("author")
    fetch(postUrl, {
        method: "POST",
        headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json'
        },
        body: JSON.stringify({
            quote: quote.value,
            author: author.value,
            likes: []
        })
    })
    .then(res => res.json())
    .then(createQuote, quote.value = "", author.value = "")
}

const addLike = (event, quote) => {
    span = event.target.querySelector("span")
    spanNum = parseInt(span.innerText)
    fetch(likeUrl, {
        method: "POST",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({
            quoteId: quote.id
        })
    })
    .then(span.innerText = ++spanNum)
}

//READ
const fetchQuotes = () => {
    fetch(quoteUrl)
    .then(res => res.json())
    .then(quotes => {
        quotes.forEach(createQuote)
    })
}

//UPDATE

//DESTROY
const deleteQuote = (event, id) => {
    let card = event.target.parentNode.parentNode
    fetch(postUrl + '/' + id, {
        method: "DELETE"
    })
    .then(card.remove())
}



//FUNCTION CALLS
fetchQuotes()