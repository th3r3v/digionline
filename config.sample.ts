const CONFIG = {
    webconnect: {
        // ennek az eszkoznek a domain vagy ip cime
        domain: 'localhost',
        // szabad ip cim ehhez a programhoz
        port: 9999
    },
    /**
     * lq - alacsony minőség
     * mq - közepes minőség
     * hq - magas minőség
     */
    videoQuality: 'hq',
    /**
     * Bejelentkezesi adatok
     */
    login: {
        email: '',
        password: ''
    },
    /**
     * EPG beallitasok
     */
    epg: {
        // true ha szuksegunk van EPG-re; false ha nem
        needle: true,
        // minden inditaskor generaljunk EPG-t?
        forceUpdate: false,
        // EPG idohatar oraban
        timeout: 24
    },
    /**
     * SSL biztonsagos kapcsolat hasznalata. Csak akkor kapcsold ki ha feltetlenul szukeges!
     * Reszletek: https://github.com/szabbenjamin/digionline/issues/25
     */
    secureConnection: true,
};

export default CONFIG;
