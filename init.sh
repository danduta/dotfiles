#!/bin/bash

on_done()
{
	for filename in ~/dotfiles/.*rc .bash_aliases .gitconfig; do
		diff $filename ~/$(basename $filename) 1>/dev/null 2>&1
		res=$?
		if [ $res -ne 0 ]; then
			echo -e "\e[0m\033[01;32m\tCOPYING $(basename $filename)...\e[0m"
			cp $filename ~
		else
			echo -e "\e[0m\033[01;32m\t$(basename $filename) ALREADY EXISTS AND IS IDENTICAL...\e[0m"
		fi
	done

	echo

	for dir in ~/dotfiles/.vim ~/dotfiles/.oh-my-zsh; do
		echo -e "\e[0m\033[01;32m\tCOPYING $(basename $dir)...\e[0m"
		cp -r $dir ~
	done

	sudo apt auto-remove -y
}

sudo apt-get install -y xclip
if [ ! -f ~/.ssh/id_ed25519.pub ]; then
	echo -e "\033[01;32m\n\tGENERATING SSH KEY...\n\e[0m"
	ssh-keygen -t ed25519 -C "danduta23@gmail.com"
	xclip -selection clipboard < ~/.ssh/id_ed25519.pub
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
sudo apt-get install -y build-essential gdb manpages-dev g++-8 python3-dev python python3 libncurses-dev cmake

sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-8 800 --slave /usr/bin/g++ g++ /usr/bin/g++-8
echo -e "\033[01;34m\n\t$(gcc --version)...\n\e[0m"
echo -e "\033[01;34m\n\t$(g++ --version)...\n\e[0m"

echo -e "\e[0m\033[01;32m\n\tINSTALLING ZSH...\n\e[0m"

sudo apt-get install -y zsh
ZSH=`sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions --quiet

vim_compiled=$(vim --version | grep "Compiled by $USER@$HOSTNAME" | wc -l)
if [ $vim_compiled -gt 0 ]; then
    echo -e "\e[0m\033[01;32m\n\tVIM ALREADY INSTALLED...\n\e[0m"
	on_done

	exit
fi

echo -e "\e[0m\033[01;32m\n\tINSTALLING VIM...\n\e[0m"

cp -r ~/dotfiles/.vim ~

git clone https://github.com/vim/vim.git --quiet && cd vim
make distclean && make clean && sudo apt remove vim
./configure --enable-pythoninterp=yes --enable-python3interp=yes
make && sudo make install

if [ $? != 0 ]; then
	echo -e "\033[01;31m\n\tFAILURE WHILE INSTALLING VIM\n\e[0m"
	on_done

	exit
fi

if [ ! -d ~/.vim/bundle/Vundle.vim ]; then
	git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim --quiet
fi

vim +PluginInstall +qall

cd ~/.vim/bundle/YouCompleteMe
sudo rm -rf ~/.vim/bundle/YouCompleteMe/third_party/ycmd/third_party/watchdog_deps/watchdog/build/lib3 2> /dev/null
./install.py --clang-completer

on_done
