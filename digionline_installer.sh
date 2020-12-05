#!/bin/bash

if [[ $(id -u) -ne 0 ]]; then echo "Kerlek futtasd root jogosultsagokkal: sudo -s"; exit 1; fi

echo "DIGIOnline servlet telepito indul...";

apt-get update
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
apt-get install -y nodejs git npm
npm install typescript -g

read -p "Hova telepitsuk? Ha nem adsz meg semmit ide kerul: $HOME/digionline `echo $'\n> '`" DIGIPATH
if [ -z $DIGIPATH ]; then DIGIPATH=$HOME/digionline; fi

git clone https://github.com/droM4X/digionline $DIGIPATH
cd $DIGIPATH;

echo "#!/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
cd $DIGIPATH
npm start" > digionline.sh
chmod +x digionline.sh

echo "#!/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
cd $DIGIPATH
systemctl stop digionline
git pull origin master && tsc main.ts
systemctl start digionline" > digionline_updater.sh
chmod +x digionline_updater.sh

npm install
cp config.sample.ts config.ts

echo "Kerlek add meg bejelentkezesi adataidat..."
sleep 3

if [[ -z "$EDITOR" ]]; then
  EDITOR=nano
fi
$EDITOR config.ts

touch epg.xml
mkdir log

echo "[Unit]
Description=digionline servlet app

[Service]
ExecStart=$DIGIPATH/digionline.sh
Restart=always
User=root
Group=root
Environment=PATH=/usr/bin:/usr/local/bin
Environment=NODE_ENV=production
WorkingDirectory=$DIGIPATH
StandardOutput=null

[Install]
WantedBy=multi-user.target" > digionline.service

echo "Beallitasok veglegesitese"
tsc main.ts
cp digionline.service /etc/systemd/system
systemctl daemon-reload
systemctl start digionline
systemctl enable digionline

echo "A telepites befejezodott.";