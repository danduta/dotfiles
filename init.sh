#!/bin/bash

echo -e "\033[01;32m\n\tGENERATING SSH KEY...\n\e[0m"
ssh-keygen -t ed25519 -C "danduta23@gmail.com"
clip < ~/.ssh/id_ed25519.pub

echo -e "\033[01;32m\n\t WAITING TO UPLOAD SSH KEY TO GITHUB...\n\e[0m"
read

echo -e "\033[01;32m\n\tUPDATING AND UPGRADING PACKAGES...\n\e[0m"
echo -e "\033[3m"
sudo apt-get update
sudo apt-get upgrade

echo -e "\e[0m\033[01;32m\n\tINSTALLING PACKAGES...\n\e[0m"
echo -e "\033[3m"
sudo apt-get install -y software-properties-common apt-transport-https wget net-tools
sudo apt-get install -y openvpn
sudo apt-get install -y build-essential gdb manpages-dev
echo -e "\033[01;34m\n\t$(gcc --version)...\n\e[0m"

sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

echo -e "\e[0m\033[01;32m\n\tCLONING PRIVATE DOTFILES...\n\e[0m"
