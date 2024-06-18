import Webconnect from "./lib/webconnect";
import {Digionline} from "./lib/digionline";
import Config from "./lib/config";
import Log from "./lib/log";

class Main {
    constructor() {
        Log.write(`Digionline (${process.env.npm_package_version}) servlet starting...`);
        this.init();

        if (Config.instance().log.level !== 'stdout') {
            Log.janitor();
        }
    }

    public init() {
        const digi = new Digionline(() => {
            const server = new Webconnect();
            server.setDigi(digi);
            server.listen();
        });
    }

}

new Main();
