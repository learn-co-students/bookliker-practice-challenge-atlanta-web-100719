document.addEventListener("DOMContentLoaded", function () {
    const listUl = document.querySelector('#list');
    const baseUrl = 'http://localhost:3000/books';
    const meData = { "id": 1, "username": "pouros" };
    fetch(baseUrl)
        .then(res => res.json())
        .then(books => {
            books.forEach((book) => {
                listUl.appendChild(bookLi(book));
            })
        })

    function bookLi(book) {
        const li = document.createElement('li');
        li.innerText = book.title;
        li.addEventListener('click', (event) => {
            replaceBookDiv(book);
        })
        return li;
    }
    function replaceBookDiv(book) {
        const bookDiv = document.querySelector('#show-panel');
        bookDiv.parentNode.replaceChild(newBookDiv(book), bookDiv);
    }

    function newBookDiv(book) {
        const userIndex = book.users.findIndex(e => e.id == meData.id);
        const img = document.createElement('img');
        img.src = book.img_url;
        const p = document.createElement('p');
        p.innerText = book.description
        const button = document.createElement('button');
        button.innerText = userIndex < 0 ? "Like" : "Unlike"
        const ul = document.createElement('ul');
        book.users.forEach(user => {
            const li = document.createElement('li');
            li.innerText = user.username;
            ul.appendChild(li);
        })
        const div = document.createElement('div');
        div.id = 'show-panel';

        button.addEventListener('click', (event) => {
            if (userIndex < 0) {
                book.users.push(meData)
            } else {
                book.users.splice(userIndex, 1);
            }
            fetch(baseUrl + '/' + book.id, {
                method: 'PATCH',
                body: JSON.stringify({ 'users': book.users }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(book => {
                    replaceBookDiv(book);
                })
        })

        div.append(img);
        div.append(p);
        div.append(ul);
        div.append(button);

        return div;
    }
});
