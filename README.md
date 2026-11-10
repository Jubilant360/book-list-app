# Book List App 📚

A clean, responsive, and minimalist Book List web application built with pure HTML, CSS, and Vanilla JavaScript. All data is persisted locally in the browser using `localStorage`, requiring no backend, database, or build tools.

## ✨ Features

- **Add New Books**: Easily track books by Title, Author, and Read status (*Read* or *Not Read*).
- **1-5 Star Ratings**: Rate books from 1 to 5 stars upon creation, in the edit modal, or by tapping stars directly on the card!
- **Persistent Storage**: All books are saved locally via `localStorage`—your library stays saved even when you refresh or close the browser.
- **Dynamic Counters**: View the total count of books at a glance, along with a breakdown of read and unread books.
- **Quick Status Toggle**: Click on the status badge (*Read* / *Not Read*) on any book card to quickly toggle its reading state.
- **Edit Book Details**: Update the title, author, or status of any book using the edit modal.
- **Safe Deletion**: Deleting a book asks for explicit confirmation with the book's title to prevent accidental removals.
- **Instant Search & Filter**: Real-time filtering by book title or author, plus quick filter tabs for *All*, *Read*, and *Not Read*.
- **Friendly Empty States**: Clean illustrations and friendly messages when your list is empty or when search queries yield no results.
- **Mobile Responsive**: Thoughtfully designed with accessible touch targets, responsive card grids, and mobile-friendly dialogs.

## 📁 Project Structure

```text
book-list-app/
├── index.html   # Markup, layout, dialogs, and SVG icons
├── style.css    # Clean, modern styles, animations, and responsive media queries
├── script.js    # Vanilla JS for state management, localStorage, and DOM interactions
└── README.md    # Project overview and documentation
```

## 🚀 Getting Started

No build process, server, or dependencies required!

1. Clone or download this repository:
   ```bash
   git clone https://github.com/Jubilant360/book-list-app.git
   ```
2. Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari).

## 🛠️ Built With

- **HTML5**: Semantic tags, modals, forms
- **CSS3**: Custom CSS properties (variables), Flexbox, CSS Grid, media queries
- **JavaScript (ES6+)**: Vanilla JS, Web Storage API (`localStorage`)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

