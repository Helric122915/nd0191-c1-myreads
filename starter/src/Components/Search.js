import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import * as BooksAPI from "../BooksAPI";
import Book from "./Book";
import PropTypes from "prop-types";
import { debounce } from "lodash";

const Search = ({ books, updateBook }) => {
  const [resultBooks, setResultBooks] = useState([]);

  const searchInputValue = (inputValue) => {
    const search = async (value) => {
      if (value === "") {
        setResultBooks([]);

        return;
      }

      const res = await BooksAPI.search(value, 20);

      if (res.error === "empty query") {
        setResultBooks([]);

        return;
      }

      const mappedResults = res
        .filter((book) => book.imageLinks !== undefined)
        .map((result) => {
          const book = books.find((book) => book.id === result.id);

          if (book) {
            result.shelf = book.shelf;
          }

          return result;
        });

      setResultBooks(mappedResults);
    };

    search(inputValue);
  };

  const debouncedResults = useMemo(() => {
    return debounce(searchInputValue, 300);
  }, []);

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <Link to="/" className="close-search">
          Close
        </Link>
        <div className="search-books-input-wrapper">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN"
            onChange={(event) => debouncedResults(event.target.value)}
          />
        </div>
      </div>
      <div className="search-books-results">
        <ol className="books-grid">
          {resultBooks.map((book) => (
            <Book key={book.id} book={book} updateBook={updateBook} />
          ))}
        </ol>
      </div>
    </div>
  );
};

Search.propTypes = {
  books: PropTypes.array.isRequired,
  updateBook: PropTypes.func.isRequired,
};

export default Search;
