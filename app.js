class Book{
    constructor(title,author,isbn) {
        this.title = title,
        this.author = author,
        this.isbn = isbn
    }
}

class bookStore{
    static getBooks() {
        let books;
        if (localStorage.getItem('books') == null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
     }

    static addBooks(book) {
        const books = bookStore.getBooks();
        books.push(book);
        localStorage.setItem('books',JSON.stringify(books))
    }

    static removeBook(isbn) {
        const books = bookStore.getBooks();
        books.forEach((book,ind) => {
            if (book.isbn == isbn) {
                books.splice(ind,1)
            }
        })
        localStorage.setItem('books',JSON.stringify(books))
    }
}

class UI{
     displayBooks() {
        const storedBooks = bookStore.getBooks()

        const books = storedBooks;
        books.forEach((ele) => UI.addBookToList(ele))
    }

    static addBookToList(book) {
        const list = document.querySelector("#book-list")
        const row = document.createElement("tr")
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</td>
        `
        list.appendChild(row);
    }

    static clearFields() {
        document.querySelector("#title").value = '';
        document.querySelector("#author").value = '';
        document.querySelector("#isbn").value = '';
    }

    static deleteBookFromList(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }
    static showAlert(cssClass,message) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `alert alert-${cssClass}`;
        msgDiv.appendChild(document.createTextNode(message));
        const container = document.querySelector(".container")
        const form = document.querySelector("#book-form")
        container.insertBefore(msgDiv,form)
        setTimeout(() => {
            if (document.querySelector(".alert")) {
                document.querySelector(".alert").remove();
            }
        },1000)
    }
}

document.addEventListener('DOMContentLoaded',new UI().displayBooks)

document.querySelector("#book-form").addEventListener('submit',(e) => {
    e.preventDefault();
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;
    if (title == '' || author == '' || isbn == '') {
        UI.showAlert("danger","Fields should not be empty")
    } else {

        const book = new Book(title, author, isbn)
        console.log(book)
        UI.addBookToList(book);
        UI.showAlert('success',"Book Added Successfully")
        bookStore.addBooks(book);
        UI.clearFields();
    }
})

document.querySelector("#book-list").addEventListener('click', (e) => {
    console.log(e.target)
    UI.deleteBookFromList(e.target)
    UI.showAlert('success',"Book Deleted Successfully")
    bookStore.removeBook(e.target.parentElement.previousElementSibling.textContent);
})