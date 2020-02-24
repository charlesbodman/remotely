# <img src="https://raw.githubusercontent.com/charlesbodman/remotely/master/icon.png" width="233"/>
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## Rsyncing simplified, push, pull, watch.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Install](#install)
- [Usage](#usage)
- [Config](#config)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Prerequisites
- rsync

## Install
```
npm install -g remotely-cli
```

## Usage

**Create remotely config (`.remotely.json`)**
```
$ remotely init
```
Run this in any parent directory from where you are going to be running `remotely`.

Remotely will climb up and use the first config file it finds
[Read about config here](#config)

Make sure you edit your config (`.remotely.json`) file after doing this.

---

**Watch local directory for changes and rsync push on change**
```
$ remotely watch
```
---

**Rsync pull down remote**
```
$ remotely pull
```
---

**Rsync push to remote**
```
$ remotely push
```
---

## Config
Remotely will look for the config file `.remotely.json` in any directory above where you call `remotely [command]`.
This means that the config can belong anywhere, as long as remotely can find it by traversing upwards

| Config        | Desc         |                |
| ------------- |:-------------:|:-------------:|
| local         | local path to sync dir | required |
| remote      | remote host and path | required |
| rsync_flags | flags to customize rsync  | optional |
| dry_run | perform dry run | optional |
| exclude | files or directories to exclude | optional |
| notify | notify when complete | optional |

**Example config**

This could live in `/Users/charliebodman/documents/example/.remotely.json`
You can create remotely config by calling `remotely init`
```javascript
{
    "local":"/Users/charliebodman/documents/example/project",
    "remote":"charlie@example.com:~/example/project"
}
```

## Maintainers

[@charlesbodman](https://github.com/@charlesbodman)

## Contribute

PRs accepted.

## License

MIT © 2017 Charles Bodman

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/charlesbodman"><img src="https://avatars2.githubusercontent.com/u/231894?v=4" width="100px;" alt=""/><br /><sub><b>Charles Bodman</b></sub></a><br /><a href="https://github.com/charlesbodman/remotely/commits?author=charlesbodman" title="Code">💻</a> <a href="https://github.com/charlesbodman/remotely/commits?author=charlesbodman" title="Documentation">📖</a></td>
    <td align="center"><a href="https://griffinledingham.me/"><img src="https://avatars2.githubusercontent.com/u/2390265?v=4" width="100px;" alt=""/><br /><sub><b>Griffin Ledingham</b></sub></a><br /><a href="https://github.com/charlesbodman/remotely/commits?author=GriffinLedingham" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!