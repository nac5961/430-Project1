// Helper function used for sorting the games
const compare = (a, b) => {
  // Convert to lower-case to ignore casing
  const nameA = a.name.toLowerCase();
  const nameB = b.name.toLowerCase();

  // a comes before b
  if (nameA > nameB) {
    return 1;
  }

  // b comes before a
  if (nameA < nameB) {
    return -1;
  }

  // same
  return 0;
};

// Helper function used for reverse sorting the games
const reverseCompare = (a, b) => compare(a, b) * -1;

// Function to sort the games
const sortGames = (arr) => {
  arr.sort(compare);
};

// Function to reverse sort the games
const reverseSortGames = (arr) => {
  arr.sort(reverseCompare);
};

// Export the functions (make them public)
module.exports.sort = sortGames;
module.exports.reverseSort = reverseSortGames;
