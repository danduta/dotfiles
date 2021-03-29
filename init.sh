#!/bin/bash

sudo apt-get install -y xclip
if [ ! -f ~/.ssh/id_ed25519.pub ]; then
	echo -e "\033[01;32m\n\tGENERATING SSH KEY...\n\e[0m"
	ssh-keygen -t ed25519 -C "danduta23@gmail.com"
	clip < ~/.ssh/id_ed25519.pub
	echo -e "\033[01;32m\n\t WAITING TO UPLOAD SSH KEY TO GITHUB...\n\e[0m"
	read
fi

echo -e "\033[01;32m\n\tUPDATING AND UPGRADING PACKAGES...\n\e[0m"
echo -e "\033[3m"
sudo apt-get update -y
sudo apt-get upgrade -y

echo -e "\e[0m\033[01;32m\n\tINSTALLING PACKAGES...\n\e[0m"
echo -e "\033[3m"
sudo apt-get install -y software-properties-common apt-transport-https wget net-tools screenfetch
sudo apt-get install -y openvpn
sudo apt-get install -y build-essential gdb manpages-dev
echo -e "\033[01;34m\n\t$(gcc --version)...\n\e[0m"

sudo apt-get install -y zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

echo -e "\e[0m\033[01;32m\n\tINSTALLING VIM...\n\e[0m"

if [ ! -f ~/.vimrc ]; then
	cp -r ~/dotfiles/.* ~
fi

sudo add-apt-repository ppa:jonathonf/vim
sudo apt update
sudo apt install -y vim

if [ ! -d ~/.vim/bundle/Vundle.vim ]; then
	git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim
fi

