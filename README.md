# Syfr - Form Cipher scripts

## Production Usage

The minified javascript is available at: https://js.syfr.app/2.4.1-beta.4/form-cipher.min.js

Integrity SHA values at: https://js.syfr.app/2.4.1-beta.4/assets-manifest.json

## Development

- Commits adhere to [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
- Releases adhere to [Semantic Versioning v2.0.0](https://semver.org/spec/v2.0.0.html)

**do not push your changes to master directly**

- Each push to master triggers a new website build on Vercel

- create `.env` similar to `.env.example`
  | ENV | How To | Why |
  | --- | ------ | --- |
  | `SYFR_FORM_ID` | get the UUID from syfr.app | use webpack HTML plugin to test form locally |
  | `GITHUB_TOKEN` | create [Github token](https://github.com/settings/tokens) | to push changes and releases |
- run `yarn develop` and make changes to the `./src`
  - webpack will watch and build to the `./.cache` directory (git-ignored)
  - test the code locally be enabling the webpack HTML plugin in `webpack.config.js`
- commit your changes using [angular conventional commit messages](https://gist.github.com/stephenparish/9941e89d80e2bc58a153) and see [our release-it config](https://github.com/syfrtech/entry-js/commit/cf38ea124cbe3081a86b5ca767cd3aa73e97988a)
  | Example Commit Message | Semver Level | Example |
  | ---------------------- | ------------ | ------- |
  | `fix: small bugfix` | patch | `1.2.3` ~> `1.2.4` |
  | `feat: my new feature` | minor | `1.2.3` ~> `1.3.0` |
  | `huge /n /n BREAKING CHANGE: beware` | major | `1.2.3` ~> `2.0.0` |

  - **REMEMBER**: Do not push your changes to master directly (see commands below)

- run `yarn checkRelease` to perform a dry-run
  - Check the release number is what you expect
  - check the release link to confirm the changelog is as expected
- run `yarn release` to perform the release (this is set to prepare the bundle, commit, push to github, etc)
- for pre-release, [use pre-release commands](https://github.com/release-it/release-it/blob/master/docs/pre-releases.md), such as `yarn checkRelease minor --preRelease=beta` or `yarn release major --preRelease`
