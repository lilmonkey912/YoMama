// index.js
const path = require("path");

let native;
try {
  native = require(
    path.join(__dirname, `build/${process.platform}/frontwindow.node`),
  );
} catch (err) {
  console.error("Failed to load native addon:", err.message);
  throw err;
}

/**
 * Get the title of the frontmost window.
 * @returns {string}
 */
function getFrontWindowTitle() {
  return native.getFrontWindowTitle();
}

module.exports = {
  getFrontWindowTitle,
};
