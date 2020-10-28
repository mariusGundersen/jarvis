cd /home/pi/jarvis

echo 'started' > node.log
until ping -c1 github.com &>/dev/null; do : sleep 1; done
echo 'pinged' >> node.log

echo 'chmod' >> node.log
sudo chmod 777 /sys/class/backlight/rpi_backlight/bl_power

echo 'turn off screensaver' >> node.log
sudo xset s off
sudo xset -dpms
sudo xset s noblank

echo 'git pull' >> node.log
git pull >> node.log
echo 'npm install' >> node.log
npm install >> node.log
echo 'npm run server' >> node.log
nohup npm run server >> node.log 2>&1 &

sleep 5
chromium-browser --kiosk 'http://localhost:3000' &