// It might be a good idea to add event listener to make sure this file 
// only runs after the DOM has finshed loading. 

// Global Variables
const quoteList = document.getElementById('quote-list')
const quoteUrl = "http://localhost:3000/quotes?_embed=likes"
const newForm = document.getElementById('new-quote-form')
const postUrl = "http://localhost:3000/quotes"
const likeUrl = "http://localhost:3000/likes"

// Event listeners
newForm.addEventListener('submit', () => postNew(event))

// Create
const createCard = (quote) => {
  let li = document.createElement('li')
  li.className = 'quote-card'
  // Don't forget this
  li.id = `quote-${quote.id}`
  li.innerHTML = `
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
        <button class='btn-danger'>Delete</button>
      </blockquote>`
  let likeButton = li.getElementsByClassName('btn-success')[0]
  let deleteButton = li.getElementsByClassName('btn-danger')[0]
  likeButton.addEventListener('click', (event) => addLike(event, quote))
  deleteButton.addEventListener('click', (event) => deleteQuote(event, quote.id))
  quoteList.appendChild(li)
}

const postNew = () => {
  event.preventDefault()
  let quote = document.getElementById('new-quote')
  let author = document.getElementById('author')
  fetch(postUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept": "application/json"
    },
    body: JSON.stringify({
      quote: quote.value,
      author: author.value,
      likes: []
    })
  })
  .then(resp => resp.json())
  // Utter nonsense
  .then(createCard, quote.value = "", author.value = "")
  .catch(alert)
}

// Read
const fetchQuotes = (event) => {
  fetch(quoteUrl)
    .then(resp => resp.json())
    .then(quotes => {
      quotes.forEach(createCard)
    })
}

// Update
// Not a PATCH because the like doesn't exist and is an object, not a number
const addLike = (event, quote) => {
  let span = event.target.querySelector("span")
  let spanNum = Number(span.innerHTML)

  fetch(likeUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "accept": "application/json"
    },
    body: JSON.stringify({
      quoteId: quote.id
    })
  })
  // .then(resp => resp.json())
  .then(span.innerHTML = ++span)
}

// Destroy
const deleteQuote = (event, id) => {
  let card = document.getElementById(`quote-${id}`)
  fetch(`${postUrl}/${id}`, {
    method: "DELETE"
  })
  .then(card.remove())
  .catch(err => alert(err))
}

// Function calls
fetchQuotes()