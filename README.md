# DIGI online servlet
Ez egy forkja az eredeti verziónak, jobb docker támogatottsággal és gyorsabb EPG-vel.

Az eredeti OMSC verzió + részletes leírást itt találod: https://github.com/szabbenjamin/digionline/

## Docker
#### Image
Alapbeállításokkal:
```
docker build -t digionline https://github.com/droM4X/digionline.git
```

Egyedi beállításokkal (pl. csatorna szűrés, sorrend változtatása):

```
git clone https://github.com/droM4X/digionline.git
cd digionline
```
Módosítod a channels könyvtárban amit szeretnél. Részletes leírás az ott található [readme.txt](channels/readme.txt) fájlban.
Ha elkészültél a fájlok alapján az image elkészítése.
```
docker build -t digionline .
```

#### Container
```
docker run -d -p 9999:9999 --restart unless-stopped --env DOMAIN=IP_vagy_DOMAIN --env EMAIL=user@domain.hu --env PASSWORD=jelszo --name digionline digionline
```
Helyi hálózaton a szerver belső ip címét ajánlott használni.

#### Frissítés (rebuild)
Az Image-ben leírtak alapján a friss image elkészítése, majd

```
docker stop digionline
docker rm digionline
docker run -d -p 9999:9999 --restart unless-stopped --env DOMAIN=IP_vagy_DOMAIN --env EMAIL=user@domain.hu --env PASSWORD=jelszo --name digionline digionline
```

Az epg automatikusan frissül 12 óránként.

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

## Kimenetek

#### IPTV adáslista fájl
```
http://[IP_vagy_DOMAIN]:9999/channels_IPTV.m3u8
```
#### TVheadend adáslista fájl
```
http://[IP_vagy_DOMAIN]:9999/channels_tvheadend.m3u8
```
#### EPG (műsorújság)
```
http://[IP_vagy_DOMAIN]:9999/epg.xml
```
Az EPG a digi saját listáját használja, így új csatorna megjelenése esetén is frissül, illetve csak az van benne, amilyen adást el lehet érni náluk. Az EPG frissülési ideje kb. 2mp, szemben az eredeti verzió 5-10 percével ;)

## Használat

__VLC__: Fájl > Hálózat megnyitása (a fenti IPTV adáslista fájl hozzáadása)

__Kodi__: Szükséges PVR kliens [IPTV Simple Client](https://kodi.wiki/view/Add-on:PVR_IPTV_Simple_Client), telepítés után meg kell adni az IPTV adáslista fájlt és az EPG linkjeit, az EPG-nél szükség esetén korrigálni az időeltolódást.
