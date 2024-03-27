export default {
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/github",
    [
      "@semantic-release/npm",
      {
        npmPublish: false
      }
    ],
    [
      "@semantic-release/exec",
      {
        prepareCmd: "npm run build"
      }
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md"
      }
    ],
    [
      "@semantic-release/git",
      {
        assets: ['CHANGELOG.md', 'package.json', 'package-lock.json', 'npm-shrinkwrap.json', 'dist/*']
      }
    ],
  ],
  repositoryUrl: "https://github.com/siaikin/baidu-index-export.git"
};