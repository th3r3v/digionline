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

#### CRON JOBOK
#### EPG ujrageneralas 12 orankent:
```
30 */12 * * * <user> <path>/digionline.epgUpdater.sh >/dev/null 2>&1
```

#### Heti automatikus frissítés:
```
10 4 * * 0 <user> <path>/digionline_updater.sh >/dev/null 2>&1
```

A fentiek a /etc/crontab-ba, vagy a /etc/cron.d/-be egy fájlba.

## Docker
#### Image:
```
docker build -t digionline https://github.com/droM4X/digionline.git
```

#### Container:
```
docker run -d -p 9999:9999 --restart unless-stopped --env DOMAIN=IP_vagy_DOMAIN --env EMAIL=user@domain.hu --env PASSWORD=jelszo --name digionline digionline
```
Helyi hálózaton a szerver belső ip címét ajánlott használni.

#### Frissítés (rebuild):
```
docker build -t digionline https://github.com/droM4X/digionline.git
docker stop digionline
docker rm digionline
docker run -d -p 9999:9999 --restart unless-stopped --env DOMAIN=IP_vagy_DOMAIN --env EMAIL=user@domain.hu --env PASSWORD=jelszo --name digionline digionline
```

Az epg automatikusan frissül 12 óránként.
