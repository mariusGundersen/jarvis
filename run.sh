cd /home/pi/jarvis

echo 'started' > node.log
until ping -c1 github.com &>/dev/null; do : sleep 1; done
echo 'pinged' >> node.log

echo 'git pull' >> node.log
git pull >> node.log
echo 'npm install' >> node.log
npm install >> node.log
echo 'npm run server' >> node.log
nohup npm run server >> node.log 2>&1 &

sleep 5
chromium-browser --kiosk 'http://localhost:3000' &