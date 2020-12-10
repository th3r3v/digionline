# DIGI online servlet (debian standalone verzió)

Eredeti OMSC verzió + részletes leírás: https://github.com/szabbenjamin/digionline/

--- 

Telepítés debian/ubuntu/raspberry pi os rendszereken:
* `sudo -s` vagy `su`
* `wget https://drom4x.github.io/digionline/digionline_installer.sh`
* `chmod +x digionline_installer.sh`
* `./digionline_installer.sh`

Heti automatikus frissítés (cron):
`10 4 * * 0 root <utvonal>/digionline_updater.sh >/dev/null 2>&1`
