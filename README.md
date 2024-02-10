# A Web client for Time Remaining on Hyperdeck

![demo](https://user-images.githubusercontent.com/66042/136679584-d0f5b3d6-8cc5-463f-9d77-50e555078684.gif)


# Requirements
- macOS or Linux
- Node.JS

macOS
```sh
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# Install NodeJS
brew install node
```

Linux/Ubuntu
```sh
# Add official NodeJS source
curl -fsSL https://deb.nodesource.com/setup_21.x | sudo -E bash -
# Install NodeJS
sudo apt-get install -y nodejs
```



# How to run

```sh
# npx github:nic/bmd_hyperdeck_time_remaining <your-hyerdeck-ip-address> [<port-for-web-page>]
# for example:
npx -y github:nic/bmd_hyperdeck_time_remaining 10.0.0.42
```
