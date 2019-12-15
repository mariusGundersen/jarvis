until ping -c1 github.com &>/dev/null; do : sleep 1; done
git pull
npm install
npm start > node.log 2>&1 &

sleep 15
firefox --kiosk "http://localhost:3000/" &