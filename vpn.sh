#!/bin/bash

read -sp 'code: ' code

unique=""

echo -e "dan.duta\n$unique$code\n" > ~/tmppas.in
echo ""
sudo openvpn --cd ~/Downloads/dan.duta --config ~/Downloads/dan.duta/dan.duta.ovpn > /dev/null 2>&1 &

sleep 3
if [ -f ~/tmppas.in ]; then
	rm ~/tmppas.in
fi

