alias audioreset="alsactl restore"
alias nosave="sudo /home/danilao/disable_audio_powersave.sh"
alias fixdns="sudo sed -i 's/127.0.0.53/8.8.8.8/g' /etc/resolv.conf && cat /etc/resolv.conf"

alias termkill="ps -aux | grep xterm | awk '{print }' | xargs -l kill -9"

alias lb="cd /home/danilao/labs"
alias py="python"
alias py3="python3"

alias vpn="sudo openvpn --cd ~/Downloads/dan.duta --config ~/Downloads/dan.duta/dan.duta.ovpn"

alias lsd="ls -dla */"

