module.exports = {

    // Ostatak konfiguracije...
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'], // Dodajte sve ekstenzije datoteka koje koristite
    // Ostatak konfiguracije..
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.js'],
  // Add other Jest configurations as needed
  moduleNameMapper: {
    "^~(.*)$": "<rootDir>/src/$1"
  }
};




  