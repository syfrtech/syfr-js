# Syfr - Form Cipher scripts

The current javascript is available at:

- [Standard Script](https://js.syfr.app/2.4.1-beta.12/form-cipher.min.js)
- [Manual Script](https://js.syfr.app/2.4.1-beta.12/form-cipher-manual.min.js)
- [Assets Manifest with subresource-integrity values](https://js.syfr.app/2.4.1-beta.12/assets-manifest.json)

## Production Usage

### Script Element for HTML Example

Add the script to your code:

```html
<!DOCTYPE html>
<html>
  <head>
    <script
      defer
      src="https://js.syfr.app/2.4.1-beta.12/formCipher.min.js"
      crossorigin="anonymous"
      integrity="sha256-...[use values from assets manifest]"
    ></script>
  </head>
  <body>
    ...
  </body>
</html>
```

Add the Syfr form UUID to your form

```html
<form data-syfr-id="aaaa-bbbb-ccc-dddd">...</form>
```

### Node Package Example

`yarn install syfr-js`

```js
import { SyfrClass } from "syfr-js";
window.addEventListener("DOMContentLoaded", () => {
  let formsCollection = document.forms; // https://developer.mozilla.org/en-US/docs/Web/API/Document/forms
  Array.from(formsCollection).forEach((form) => {
    new SyfrClass(form);
    return;
  });
});
```

Add the Syfr form UUID to your form

```html
<form data-syfr-id="aaaa-bbbb-ccc-dddd">...</form>
```

### React Package Example

`yarn install syfr-js`

```js
import { SyfrForm } from "syfr-js";
function myForm(props){
  return <SyfrForm id="aaaa-bbbb-ccc-dddd" Form={<form>...</form>}>
}
```

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
