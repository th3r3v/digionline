# DIGI online servlet (debian standalone / docker)
Eredeti OMSC verzió + részletes leírás: https://github.com/szabbenjamin/digionline/

---
## STANDALONE debian/ubuntu/raspberry pi os rendszereken:
1. `sudo -s` vagy `su`
2. `wget https://drom4x.github.io/digionline/digionline_installer.sh`
3. `chmod +x digionline_installer.sh`
4. `./digionline_installer.sh`

##### CRON JOBOK
EPG ujrageneralas 12 orankent:
`30 */12 * * * <user> <path>/digionline.epgUpdater.sh >/dev/null 2>&1`

Heti automatikus frissítés:
`10 4 * * 0 root <path>/digionline_updater.sh >/dev/null 2>&1`

A fentiek a /etc/crontab-ba, vagy a /etc/cron.d/-be egy fajlba.

## Docker
Image:
`sudo docker build -t digionline https://github.com/droM4X/digionline.git`

Container:
`sudo docker run -d -p 9999:9999 --restart unless-stopped --env DOMAIN=IP_vagy_DOMAIN --env EMAIL=user@domain.hu --env PASSWORD=jelszo --name digionline digionline`

Az epg updatelese minden nap hajnali 2-kor tortenik.
