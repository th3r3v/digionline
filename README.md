# DIGI online servlet
[![Github last commit](https://img.shields.io/github/last-commit/th3r3v/digionline)](https://github.com/th3r3v/digionline)
[![Releases](https://img.shields.io/github/tag/th3r3v/digionline.svg?style=flat-square)](https://github.com/th3r3v/digionline/releases)
[![License](https://img.shields.io/badge/license-GPLv3-blue)](./LICENSE.md) 
[![GitHub Activity](https://img.shields.io/github/commit-activity/y/th3r3v/digionline.svg?label=commits)](https://github.com/th3r3v/digionline/commits)

Ez a repository főként [droM4X fork](https://github.com/droM4X/digionline)jára támaszkodik. Az én igényeimhez az ő verziója állt legközelebb, azonban használat közben belefutottam egy számomra igen limitáló hibába. Mivel [droM4X fork](https://github.com/droM4X/digionline)ja közel 20 committal le volt maradva az upstream-től, illetve egy ideje már archiválva lett, így végül amellett döntöttem, hogy ezt a verziót az upstream repositoryból hozom létre és így a legfrissebb verzióba húzom bele droM4X változtatásait.

<details>
    <summary>Háttérsztori - avagy minek még egy fork?</summary>

Ez a repository azért jött létre, mert a 2024-es foci EB alatt ismét felvetődött az igény, hogy jó lenne az M4 Sportot integrálni az ismerősökkel közösen használt Emby szerverre, hogy egyrészt könnyebben követhessük a meccseket TV-n, bárhol is vagyunk (Vicc, hogy 2024-ben még mindig Airplay/Képernyő tükrözéssel lehet csak az M4 sportot Samsung és LG okos TV-ken nézni... Nesze neked közmédia), illetve emellett az Emby PVR funkcióját felhasználva mindenki könnyedén rögzíthesse és visszanézhessen azon meccseket, amelyekre kíváncsi.

Ehhez persze szükség volt arra, hogy a (szülők Digi előfizetésével használható) DigiOnline-t valami értelmesebb formában meg lehessen etetni az Emby-vel, ezért kezdtem el ismét használni [droM4X verzióját](https://github.com/droM4X/digionline). Sajnos hamar kiderült, hogy az EPG funkció tartalmaz egy (az eredeti szoftverből jövő) hibát, amely miatt nem kezeli megfelelően a téli-nyári időszámítás közötti különbséget. Biztos vannak kliensek, ahol ez nem probléma, az általam használt Emby azonban az EPG-ből jövő UTC időt használja, amely esetén hardcode-olva volt a +0100 időzóna eltolás.
</details>

## Ez egy ún. "Heavily opinionated" fork. 

*Opinionated software* alatt olyan programot értünk, amely esetén az adott program egy meglehetősen fix céllal jön létre, valamint a fejlesztőknek fix elképzelése van arról, hogy mi az amit a programnak tudnia kell és azt milyen módon kell elérnie.

Személyes meglátásom szerint az ilyen jellegű alkalmazásoknak manapság már csak és kizárólag konténerként van létjogosultsága, ezért minden olyan dolog, amely a konténerizációhoz nem szükséges, eltávolításra kerül ebből a verzióból.

Eredeti verzió: [szabbenjamin/digionline](https://github.com/szabbenjamin/digionline).  
Felhasznált fork: [droM4X/digionline](https://github.com/droM4X/digionline)

## Docker használat
docker-compose fájl, pl. portainerhez

```docker
---
version: "3"
services:
  digionline:
    image: anthony199206/digionline:latest
    environment:
      - DOMAIN=
      - PORT=9999
      - EMAIL=
      - PASSWORD=
    ports:
      - 9999:9999/tcp
    restart: unless-stopped
``` 

Az environment-nél szereplő adatokat kell megadni idézőjelek nélkül! A domain a gép belső ip címe, pl.: DOMAIN=192.168.1.2

Az email és password a digionline oldalon használt belépési adataid, amit a digi.hu oldalon állítottál be (nem a digi-s belépési adatok)

#### Image
Alapbeállításokkal:
```shell
docker build -t digionline https://github.com/th3r3v/digionline.git
```

Egyedi beállításokkal (pl. csatorna szűrés, sorrend változtatása):

```shell
git clone https://github.com/th3r3v/digionline.git
cd digionline
```
Módosítod a channels könyvtárban amit szeretnél. Részletes leírás az ott található [readme.txt](channels/readme.txt) fájlban.
Ha elkészültél a fájlok alapján az image elkészítése.
```shell
docker build -t digionline .
```

#### Container
```shell
docker run -d -p 9999:9999 --restart unless-stopped --env DOMAIN=IP_vagy_DOMAIN --env EMAIL=user@domain.hu --env PASSWORD=jelszo --name digionline digionline
```
Helyi hálózaton a szerver belső ip címét ajánlott használni.

#### Frissítés (rebuild)
Az Image-ben leírtak alapján a friss image elkészítése, majd

```shell
docker stop digionline
docker rm digionline
docker run -d -p 9999:9999 --restart unless-stopped --env DOMAIN=IP_vagy_DOMAIN --env EMAIL=user@domain.hu --env PASSWORD=jelszo --name digionline digionline
```

Az epg automatikusan frissül 12 óránként.

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

## Köszönetnyilvánítás

Ezúton is szeretnék köszönetet nyilvánítani [droM4X](https://github.com/droM4X) és [szabbenjamin](https://github.com/szabbenjamin) számára, valamint mindenki más számára aki hozzájárult valamilyen formában az eredeti verzió létrejöttéhez.
