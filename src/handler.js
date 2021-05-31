const Book = require("./books");
const { successed, failed, errormsg } = require("./default-resp");
const temp = new Map();
const empty = undefined && null;

//fungsi start
const addBooks = (request, h) => {
  try {
    const { payload } = request;
    if (payload.name === empty) {
      const message = "Gagal menambahkan buku. Mohon isi nama buku";
      return h
        .response(failed({ responseMessage: message, withData: false }))
        .code(400);
    }

    if (payload.readPage > payload.pageCount) {
      const message =
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount";
      return h
        .response(failed({ responseMessage: message, withData: false }))
        .code(400);
    }

    const newBook = new Book(payload);
    temp.set(newBook.id, newBook);
    return h
      .response(
        successed({
          responseMessage: "Buku berhasil ditambahkan",
          responseData: { bookId: newBook.id },
        })
      )
      .code(201);
  } catch (error) {
    const message = "Buku gagal ditambahkan";
    return h.response(errormsg(message)).code(500);
  }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ f2
const getBooks = (request, h) => {
  const { bookIdParam } = request.params;
  const bookById = temp.get(bookIdParam);
  if (bookIdParam !== empty) {
    if (bookById === empty) {
      const message = "Buku tidak ditemukan";
      return h.response(failed({ responseMessage: message })).code(404);
    }
    return h
      .response(successed({ responseData: { book: bookById } }))
      .code(200);
  }
  const { name, reading, finished } = request.query;
  const allBooks = [...temp.values()];
  let booksByQuery = allBooks;

  if (name !== empty) {
    booksByQuery = allBooks.filter((value) =>
      value.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (reading !== empty) {
    booksByQuery = allBooks.filter(
      (value) => value.reading === (reading === "1")
    );
  }

  if (finished !== empty) {
    booksByQuery = allBooks.filter(
      (value) => value.finished === (finished === "1")
    );
  }

  const finalBooksResult = booksByQuery.map((bookvalue) =>
    bookvalue.getIdNameAndPublisher()
  );
  return h
    .response(successed({ responseData: { books: finalBooksResult } }))
    .code(200);
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ f3
const updateBooks = (request, h) => {
  const { payload } = request;
  const { bookIdParam } = request.params;
  const searchedBook = temp.get(bookIdParam);

  if (payload.name === empty) {
    const message = "Gagal memperbarui buku. Mohon isi nama buku";
    return h
      .response(failed({ responseMessage: message, withData: false }))
      .code(400);
  }

  if (payload.readPage > payload.pageCount) {
    const message =
      "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount";
    return h
      .response(failed({ responseMessage: message, withData: false }))
      .code(400);
  }

  if (searchedBook === empty) {
    const message = "Gagal memperbarui buku. Id tidak ditemukan";
    return h
      .response(failed({ responseMessage: message, withData: false }))
      .code(404);
  }

  searchedBook.updateBook(payload);
  return h
    .response(successed({ responseMessage: "Buku berhasil diperbarui" }))
    .code(200);
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ f4
const deleteBooks = (request, h) => {
  const { bookIdParam } = request.params;
  const searchedBook = temp.get(bookIdParam);
  if (searchedBook === empty) {
    const message = "Buku gagal dihapus. Id tidak ditemukan";
    return h
      .response(failed({ responseMessage: message, withData: false }))
      .code(404);
  }

  temp.delete(bookIdParam);
  return h
    .response(successed({ responseMessage: "Buku berhasil dihapus" }))
    .code(200);
};

module.exports = {
  addBooks,
  getBooks,
  updateBooks,
  deleteBooks,
};
