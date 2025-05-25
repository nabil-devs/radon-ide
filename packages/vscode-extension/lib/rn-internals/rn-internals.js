// This implementation is only used when bundling the code for Radon Connect runtime.
// When Radon controls the metro, it replaces imports of this file with imports to
// React-Native specific version of it.

function metroImportDefault(moduleId) {
  return globalThis.__r.importDefault(moduleId);
}

module.exports = {
  XHRInterceptor: metroImportDefault(
    "node_modules/react-native/Libraries/Network/XHRInterceptor.js"
  ),
};
