# DIGI online servlet (debian standalone / docker)
Eredeti OMSC verzió + részletes leírás: https://github.com/szabbenjamin/digionline/

---
## STANDALONE debian/ubuntu/raspberry pi os rendszereken:
`sudo -s` vagy `su`
```
wget https://drom4x.github.io/digionline/digionline_installer.sh
chmod +x digionline_installer.sh
./digionline_installer.sh
```

### CRON JOBOK
#### EPG újragenerálás 12 óránként
```
30 */12 * * * <user> <path>/digionline.epgUpdater.sh >/dev/null 2>&1
```

#### Heti automatikus frissítés
```
10 4 * * 0 <user> <path>/digionline_updater.sh >/dev/null 2>&1
```

A fentiek a /etc/crontab-ba, vagy a /etc/cron.d/-be egy fájlba.

## Docker
#### Image
```
docker build -t digionline https://github.com/droM4X/digionline.git
```

#### Container
```
docker run -d -p 9999:9999 --restart unless-stopped --env DOMAIN=IP_vagy_DOMAIN --env EMAIL=user@domain.hu --env PASSWORD=jelszo --name digionline digionline
```
Helyi hálózaton a szerver belső ip címét ajánlott használni.

#### Frissítés (rebuild)
```
docker build -t digionline https://github.com/droM4X/digionline.git
docker stop digionline
docker rm digionline
docker run -d -p 9999:9999 --restart unless-stopped --env DOMAIN=IP_vagy_DOMAIN --env EMAIL=user@domain.hu --env PASSWORD=jelszo --name digionline digionline
```

Az epg automatikusan frissül 12 óránként.

## Használat

#### Adáslista fájl (.m3u8)
```
http://[IP_vagy_DOMAIN]:9999/channels_IPTV.m3u8
```
#### Epg
```
http://[IP_vagy_DOMAIN]:9999/epg.xml
```

__VLC-vel__: Fájl > Hálózat megnyitása > adáslista fájl hozzáadása

__Kodival__: Szükséges PVR kliens [IPTV Simple Client](https://kodi.wiki/view/Add-on:PVR_IPTV_Simple_Client), telepítés után kell adni az adáslista és az epg linkjeit, az EPG-nél szükség esetén korrigálni az időeltolódást.
