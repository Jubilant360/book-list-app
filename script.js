/**
 * BookTracker - Personal Book List Application
 * Pure Vanilla JavaScript with localStorage persistence
 */

(function () {
  'use strict';

  // --- Constants & Storage Key ---
  const STORAGE_KEY = 'booklist_app_data';

  // --- State ---
  let books = [];
  let currentFilter = 'all'; // 'all' | 'read' | 'unread'
  let searchQuery = '';
  let bookToDeleteId = null;

  // --- DOM Elements ---
  const totalBooksCountEl = document.getElementById('totalBooksCount');
  const readBooksCountEl = document.getElementById('readBooksCount');
  const unreadBooksCountEl = document.getElementById('unreadBooksCount');

  const addBookForm = document.getElementById('addBookForm');
  const bookTitleInput = document.getElementById('bookTitle');
  const bookAuthorInput = document.getElementById('bookAuthor');
  const bookIsReadInput = document.getElementById('bookIsRead');

  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const filterTabs = document.querySelectorAll('.filter-tab');

  const booksListEl = document.getElementById('booksList');
  const emptyStateEl = document.getElementById('emptyState');
  const noResultsStateEl = document.getElementById('noResultsState');
  const noResultsQueryEl = document.getElementById('noResultsQuery');
  const resetSearchBtn = document.getElementById('resetSearchBtn');

  // Edit Modal Elements
  const editModal = document.getElementById('editModal');
  const editBookForm = document.getElementById('editBookForm');
  const editBookIdInput = document.getElementById('editBookId');
  const editBookTitleInput = document.getElementById('editBookTitle');
  const editBookAuthorInput = document.getElementById('editBookAuthor');
  const editBookIsReadInput = document.getElementById('editBookIsRead');
  const closeEditModalBtn = document.getElementById('closeEditModalBtn');
  const cancelEditBtn = document.getElementById('cancelEditBtn');

  // Delete Modal Elements
  const deleteModal = document.getElementById('deleteModal');
  const deleteBookTitleEl = document.getElementById('deleteBookTitle');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

  // Toast
  const toastEl = document.getElementById('toast');
  let toastTimeout = null;

  // --- Initialization ---
  function init() {
    loadBooksFromStorage();
    attachEventListeners();
    render();
  }

  // --- LocalStorage Operations ---
  function loadBooksFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        books = JSON.parse(data);
        if (!Array.isArray(books)) {
          books = [];
        }
      } else {
        books = [];
      }
    } catch (e) {
      console.error('Failed to load books from localStorage:', e);
      books = [];
    }
  }

  function saveBooksToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    } catch (e) {
      console.error('Failed to save books to localStorage:', e);
      showToast('Error saving data to browser storage', 'danger');
    }
  }

  // --- Toast Notification ---
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    toastTimeout = setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2800);
  }

  // --- Stats Calculation ---
  function updateStats() {
    const total = books.length;
    const read = books.filter(b => b.isRead).length;
    const unread = total - read;

    totalBooksCountEl.textContent = total;
    readBooksCountEl.textContent = read;
    unreadBooksCountEl.textContent = unread;
  }

  // --- Filter & Search Logic ---
  function getFilteredBooks() {
    const query = searchQuery.trim().toLowerCase();

    return books.filter(book => {
      // Filter by status tab
      if (currentFilter === 'read' && !book.isRead) return false;
      if (currentFilter === 'unread' && book.isRead) return false;

      // Filter by search query (title or author)
      if (query) {
        const matchesTitle = book.title.toLowerCase().includes(query);
        const matchesAuthor = book.author.toLowerCase().includes(query);
        return matchesTitle || matchesAuthor;
      }

      return true;
    });
  }

  // --- Rendering UI ---
  function render() {
    updateStats();

    // Toggle clear search button visibility
    if (searchInput.value.trim().length > 0) {
      clearSearchBtn.style.display = 'block';
    } else {
      clearSearchBtn.style.display = 'none';
    }

    // Handle overall empty state (no books added yet)
    if (books.length === 0) {
      booksListEl.style.display = 'none';
      emptyStateEl.style.display = 'flex';
      noResultsStateEl.style.display = 'none';
      return;
    }

    emptyStateEl.style.display = 'none';

    // Get matching books for active search / filter
    const visibleBooks = getFilteredBooks();

    // Handle search/filter empty results
    if (visibleBooks.length === 0) {
      booksListEl.style.display = 'none';
      noResultsStateEl.style.display = 'flex';
      noResultsQueryEl.textContent = searchQuery.trim() || currentFilter;
      return;
    }

    noResultsStateEl.style.display = 'none';
    booksListEl.style.display = 'flex';
    booksListEl.innerHTML = '';

    // Render list items safely with DOM methods
    visibleBooks.forEach(book => {
      const card = createBookCardElement(book);
      booksListEl.appendChild(card);
    });
  }

  // --- Create Book Card Element ---
  function createBookCardElement(book) {
    const card = document.createElement('article');
    card.className = `book-card ${book.isRead ? 'is-read' : 'is-unread'}`;
    card.setAttribute('data-id', book.id);

    // Book Info Container
    const infoDiv = document.createElement('div');
    infoDiv.className = 'book-info';

    const titleEl = document.createElement('h3');
    titleEl.className = 'book-title';
    titleEl.textContent = book.title;

    const authorEl = document.createElement('p');
    authorEl.className = 'book-author';
    authorEl.textContent = `by ${book.author}`;

    const metaDiv = document.createElement('div');
    metaDiv.className = 'book-meta';

    // Status Badge (Interactive toggle on click)
    const badge = document.createElement('button');
    badge.type = 'button';
    badge.className = `status-badge ${book.isRead ? 'read' : 'unread'}`;
    badge.title = 'Click to toggle read status';
    badge.setAttribute('aria-label', `Status: ${book.isRead ? 'Read' : 'Not read'}. Click to toggle.`);

    const dot = document.createElement('span');
    dot.className = 'status-dot';

    const badgeText = document.createTextNode(book.isRead ? 'Read' : 'Not read');

    badge.appendChild(dot);
    badge.appendChild(badgeText);

    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleBookReadStatus(book.id);
    });

    metaDiv.appendChild(badge);
    infoDiv.appendChild(titleEl);
    infoDiv.appendChild(authorEl);
    infoDiv.appendChild(metaDiv);

    // Action Buttons
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'book-actions';

    // Edit Button
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'icon-btn edit-btn';
    editBtn.title = 'Edit book';
    editBtn.setAttribute('aria-label', `Edit ${book.title}`);
    editBtn.innerHTML = `
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    `;
    editBtn.addEventListener('click', () => openEditModal(book.id));

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'icon-btn delete-btn';
    deleteBtn.title = 'Delete book';
    deleteBtn.setAttribute('aria-label', `Delete ${book.title}`);
    deleteBtn.innerHTML = `
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
      </svg>
    `;
    deleteBtn.addEventListener('click', () => openDeleteModal(book.id));

    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    card.appendChild(infoDiv);
    card.appendChild(actionsDiv);

    return card;
  }

  // --- Add Book Handler ---
  function handleAddBook(e) {
    e.preventDefault();

    const title = bookTitleInput.value.trim();
    const author = bookAuthorInput.value.trim();
    const isRead = bookIsReadInput.checked;

    if (!title || !author) {
      showToast('Please enter both a title and an author');
      return;
    }

    const newBook = {
      id: 'book_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      title: title,
      author: author,
      isRead: isRead,
      createdAt: Date.now()
    };

    // Add to beginning of list
    books.unshift(newBook);
    saveBooksToStorage();
    render();

    // Reset Form
    addBookForm.reset();
    bookTitleInput.focus();
    showToast(`Added "${newBook.title}"`);
  }

  // --- Toggle Read Status ---
  function toggleBookReadStatus(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    book.isRead = !book.isRead;
    saveBooksToStorage();
    render();
    showToast(`Marked "${book.title}" as ${book.isRead ? 'Read' : 'Not read'}`);
  }

  // --- Edit Modal Operations ---
  function openEditModal(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    editBookIdInput.value = book.id;
    editBookTitleInput.value = book.title;
    editBookAuthorInput.value = book.author;
    editBookIsReadInput.checked = book.isRead;

    editModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    editBookTitleInput.focus();
  }

  function closeEditModal() {
    editModal.classList.remove('active');
    document.body.style.overflow = '';
    editBookForm.reset();
  }

  function handleSaveEdit(e) {
    e.preventDefault();

    const bookId = editBookIdInput.value;
    const title = editBookTitleInput.value.trim();
    const author = editBookAuthorInput.value.trim();
    const isRead = editBookIsReadInput.checked;

    if (!title || !author) {
      showToast('Title and author cannot be empty');
      return;
    }

    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) return;

    books[bookIndex].title = title;
    books[bookIndex].author = author;
    books[bookIndex].isRead = isRead;
    books[bookIndex].updatedAt = Date.now();

    saveBooksToStorage();
    render();
    closeEditModal();
    showToast(`Updated "${title}"`);
  }

  // --- Delete Confirmation Modal Operations ---
  function openDeleteModal(bookId) {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    bookToDeleteId = book.id;
    deleteBookTitleEl.textContent = `"${book.title}"`;

    deleteModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    cancelDeleteBtn.focus();
  }

  function closeDeleteModal() {
    deleteModal.classList.remove('active');
    document.body.style.overflow = '';
    bookToDeleteId = null;
  }

  function handleConfirmDelete() {
    if (!bookToDeleteId) return;

    const book = books.find(b => b.id === bookToDeleteId);
    const bookTitle = book ? book.title : 'Book';

    books = books.filter(b => b.id !== bookToDeleteId);
    saveBooksToStorage();
    render();
    closeDeleteModal();
    showToast(`Deleted "${bookTitle}"`);
  }

  // --- Event Listeners Setup ---
  function attachEventListeners() {
    // Add Book form submission
    addBookForm.addEventListener('submit', handleAddBook);

    // Live search input
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      render();
    });

    // Clear search button
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      render();
      searchInput.focus();
    });

    // Filter status tabs
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        currentFilter = tab.getAttribute('data-filter');
        render();
      });
    });

    // Reset search from empty state
    resetSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      currentFilter = 'all';
      filterTabs.forEach(t => {
        const isAll = t.getAttribute('data-filter') === 'all';
        t.classList.toggle('active', isAll);
        t.setAttribute('aria-selected', isAll ? 'true' : 'false');
      });
      render();
    });

    // Edit modal events
    editBookForm.addEventListener('submit', handleSaveEdit);
    closeEditModalBtn.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);

    // Delete modal events
    confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
    cancelDeleteBtn.addEventListener('click', closeDeleteModal);

    // Modal click outside to dismiss
    editModal.addEventListener('click', (e) => {
      if (e.target === editModal) closeEditModal();
    });

    deleteModal.addEventListener('click', (e) => {
      if (e.target === deleteModal) closeDeleteModal();
    });

    // Keyboard navigation (Escape key closes open modals)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (editModal.classList.contains('active')) closeEditModal();
        if (deleteModal.classList.contains('active')) closeDeleteModal();
      }
    });
  }

  // --- Start the App on DOM ready ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

