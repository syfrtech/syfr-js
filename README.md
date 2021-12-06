# Sample client site with form encrypter

## Usage

**do not push your changes directly**

- create .env similar to .env.example (set a Syfr Form Id)
- run `yarn develop` and make changes to the `./src`
  - webpack will watch and build to the `./.cache` directory (ignored)
  - test the code locally be enabling the webpack HTML plugin in `webpack.config.js`
- commit your changes using [angular conventional commit messages](https://gist.github.com/stephenparish/9941e89d80e2bc58a153)
  - ex: commit `fix: small bugfix` increments patch-level (`1.2.3 ~> 1.2.4`)
  - ex: commit `feat: my new feature` increments minor-level (`1.2.3 ~> 1.3.0`)
  - ex: commit `whatever /n /n BREAKING: beware we have made breaking changes` increments minor-level (`1.2.3 ~> 2.0.0`)
- run `yarn checkRelease` to perform a dry-run and make sure appropriate actions will be taken
- run `yarn release` to perform the release (this is set to prepare the bundle, commit, push to github, etc)
