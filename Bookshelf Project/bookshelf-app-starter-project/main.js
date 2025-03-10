document.addEventListener("DOMContentLoaded", function () {
    const bookForm = document.getElementById("bookForm");
    const searchInput = document.getElementById("searchBookTitle");
    const searchButton = document.getElementById("searchSubmit");
    const incompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");

    let books = JSON.parse(localStorage.getItem("books")) || [];

    function saveToLocalStorage() {
        localStorage.setItem("books", JSON.stringify(books));
    }

    function renderBooks(filteredBooks = null) {
        incompleteBookList.innerHTML = "";
        completeBookList.innerHTML = "";
        const bookList = filteredBooks || books;
        
        bookList.forEach((book) => {
            const bookItem = document.createElement("div");
            bookItem.setAttribute("data-bookid", book.id);
            bookItem.setAttribute("data-testid", "bookItem");
            bookItem.innerHTML = `
                <h3 data-testid="bookItemTitle">${book.title}</h3>
                <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
                <p data-testid="bookItemYear">Tahun: ${book.year}</p>
                <div>
                    <button data-testid="bookItemIsCompleteButton">${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}</button>
                    <button data-testid="bookItemDeleteButton">Hapus Buku</button>
                    <button data-testid="bookItemEditButton">Edit Buku</button>
                </div>
            `;

            bookItem.querySelector("[data-testid='bookItemIsCompleteButton']").addEventListener("click", function () {
                book.isComplete = !book.isComplete;
                saveToLocalStorage();
                renderBooks();
            });

            bookItem.querySelector("[data-testid='bookItemDeleteButton']").addEventListener("click", function () {
                books = books.filter((b) => b.id !== book.id);
                saveToLocalStorage();
                renderBooks();
            });

            bookItem.querySelector("[data-testid='bookItemEditButton']").addEventListener("click", function () {
                document.getElementById("bookFormTitle").value = book.title;
                document.getElementById("bookFormAuthor").value = book.author;
                document.getElementById("bookFormYear").value = book.year;
                document.getElementById("bookFormIsComplete").checked = book.isComplete;
                books = books.filter((b) => b.id !== book.id);
                saveToLocalStorage();
                renderBooks();
            });

            if (book.isComplete) {
                completeBookList.appendChild(bookItem);
            } else {
                incompleteBookList.appendChild(bookItem);
            }
        });
    }

    bookForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const title = document.getElementById("bookFormTitle").value;
        const author = document.getElementById("bookFormAuthor").value;
        const year = parseInt(document.getElementById("bookFormYear").value);
        const isComplete = document.getElementById("bookFormIsComplete").checked;

        if (!isNaN(year)) {
            const newBook = {
                id: Date.now().toString(),
                title,
                author,
                year,
                isComplete,
            };
            books.push(newBook);
            saveToLocalStorage();
            renderBooks();
            bookForm.reset();
        } else {
            alert("Tahun harus berupa angka.");
        }
    });

    searchButton.addEventListener("click", function (event) {
        event.preventDefault();
        const query = searchInput.value.toLowerCase();
        if (query === "") {
            renderBooks();
        } else {
            const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query));
            renderBooks(filteredBooks);
        }
    });

    renderBooks();
});
