export default {
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/github",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md"
      }
    ],
    "@semantic-release/git",
  ],
  repositoryUrl: "https://github.com/siaikin/baidu-index-export.git"
};