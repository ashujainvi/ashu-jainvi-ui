// Function creation steps:

// Build a function called getPage(items, page, pageSize) that returns the items for a given page (first page index is 1, not 0).
// where items argument is an array of number.
// where page argument is also a number
// pageSize is the number of array elements in items array returned by the function

// Example: getPage([1,2,3,4,5,6,7], 2, 3) → { items: [4,5,6], totalPages: 3, hasNext: true, hasPrev: true }

function getPage(items, page, pageSize) {
  const totalPages = Math.ceil(items.length / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: items.slice(start, end),
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}
