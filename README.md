# DIGI online servlet (debian standalone verzió)

Eredeti OMSC verzió + részletes leírás: https://github.com/szabbenjamin/digionline/

--- 

Telepítés debian/ubuntu/raspberry pi os rendszereken:
* `sudo -s` vagy `su`
* `wget https://drom4x.github.io/digionline/digionline_installer.sh`
* `chmod +x digionline_installer.sh`
* `./digionline_installer.sh`

---

_CRON JOBOK_

EPG ujrageneralas 12 orankent:
`30 */12 * * * <user> <path>/digionline.epgUpdater.sh >/dev/null 2>&1`

Heti automatikus frissítés:
`10 4 * * 0 root <path>/digionline_updater.sh >/dev/null 2>&1`