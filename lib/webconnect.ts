import * as http from 'http';
import {Digionline} from "./digionline";
import Log from "./log";
import CONFIG from "../config";
import FileHandler from "./file";
import Common from "./common";

class Webconnect {
    private digi : Digionline;
    private server : any;
    private currentChannel : number;

    public constructor() {
        const filesAllowed = [
            '/channels_IPTV.m3u8',
            '/channels_tvheadend.m3u8',
            '/epg.xml',
            '/channels.csv'
        ];

        this.server = http.createServer((request, response) => {
            const get = decodeURIComponent(request.url);

            if (get.indexOf('/channel/') !== -1) {
                this.getChannel(get, response);
            }
            else if (filesAllowed.indexOf(get) !== -1) {
                this.getFile(get, response);
            }
            else {
                Log.write('File or service not found', get);
                response.end();
            }
        });

        this.showServices(filesAllowed);
    }

    private showServices (filesAllowed : Array<string>) : void {
        Log.write('Available channel list formats for external players');
        for (let file of filesAllowed) {
            Log.write(`--> http://${CONFIG.webconnect.domain}:${CONFIG.webconnect.port}${file}`);
        }
    }

    public listen() : void {
        try {
            this.server.listen(CONFIG.webconnect.port);
            Log.write('Server is up and listening');
        } catch (e) {
            Log.error(e);
        }
    }

    public setDigi(digi : Digionline) : void {
        this.digi = digi;
    }

    private getChannel(get : string, response : any) : void {
        const self = this;
        let id : number = Number(get.replace('/channel/', '').replace('.m3u8', ''));
        let channelId : string = 'id'+id;
        let channelName: string = this.digi.channelOrder[channelId];
    
        if (CONFIG.log.level === 'full'){
            Log.write(`GET channel ${channelName} (${id})`);
        }

        if (this.currentChannel !== id){
            Log.write(`Channel change to ${channelName} (${id})`);
            self.digi.hello(id, true);
            this.currentChannel = id;
        }

        this.digi.getChannel(id, channel => {
            const channelUrl = channel.url.replace('https', 'http');
            http.get(channelUrl, function (proxyRes) {
                let data = '';
                proxyRes.on('data', function (chunk) {
                    data += chunk;
                    if (CONFIG.log.level === 'full'){
                        Log.write('Buffering...', channel.id, channel.name, Common.getUrlVars(channel.url)['q']);
                    }
                });
                proxyRes.on('end', function () {
                    response.end(data);
                    if (CONFIG.log.level === 'full'){
                        Log.write('Playing...', channel.id, channel.name, Common.getUrlVars(channel.url)['q']);
                    }
                    self.digi.hello(channel.id);
                });
                proxyRes.on('error', function () {
                    Log.error(arguments);
                });
            });
        });
    }

    private getFile(get: string, response : any) : void {
        if (CONFIG.log.level === 'full'){
            Log.write('file webrequested', get);
        }
        const fileContent = FileHandler.readFile(`.${get}`).toString();
        response.write(fileContent);
        response.end();
    }
}

export default Webconnect;
