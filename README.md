# remotely

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
npm install -g https://github.com/charlesbodman/remotely
```

## Usage

**Create remotely config**
```
remotely init
```

**Watch local directory for changes and rsync push on change**
```
remotely watch
```

**Rsync pull down remote**
```
remotely pull
```

**Rsync push to remote**
```
remotely push
```

## Config
Remotely will look for the config file `.remotely.json` in any directory above where you call `remotely [command]`.
This means that the config can belong anywhere, as long as remotely can find it by traversing upwards

| Config        | Desc         |                |
| ------------- |:-------------:|:-------------:|
| local         | local path to sync dir | required |
| remote      | remote host and path | required |
| rsync_flags | flags to customize rsync  | optional |

**Example config**

This could live in `/Users/charliebodman/documents/kano/apps/.remotely.json` 
You can create remotely config by calling `remotely init`
```javascript
{
    "local":"/Users/charliebodman/documents/kano/apps", 
    "remote":"charlie@example.com:~/kano/apps"
    "rsync_flags":"-Wavzh --stats --delete"
}
```

## Maintainers

[@charlesbodman](https://github.com/@charlesbodman)

## Contribute

PRs accepted.

Small note: If editing the README, please conform to the [standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## License

MIT © 2017 Charles Bodman
