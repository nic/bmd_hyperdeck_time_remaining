# A Web client for Time Remaining on Hyperdeck

![demo](https://user-images.githubusercontent.com/66042/136679584-d0f5b3d6-8cc5-463f-9d77-50e555078684.gif)


# Requirements
- macOS or Linux
- Node.JS
- NPX

macOS
```sh
# Install homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

brew install node
npm i -g npx
```

Linux/Ubuntu
```sh
# Add official NodeJS source
curl -fsSL https://deb.nodesource.com/setup_21.x | sudo -E bash -

sudo apt-get install -y nodejs
npm i -g npx
```



# How to run

```sh
# npx github:nic/bmd_hyperdeck_time_remaining <your-hyerdeck-ip-address> [<port-for-web-page>]
# for example:
npx github:nic/bmd_hyperdeck_time_remaining 10.0.0.42
```
