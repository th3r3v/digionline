import Common from "./common";
import CONFIG from "../config";
import Log from "./log";
import FileHandler from "./file";

const atob = require('atob');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM(`<!DOCTYPE html>`);
const $ = require('jquery')(window);
var request = require('request');
var request = request.defaults({jar: true});
const fs = require('fs');

/**
 * Olvasnivalók:
 * https://en.wikipedia.org/wiki/Electronic_program_guide
 * https://kodi.wiki/view/Add-on:PVR_IPTV_Simple_Client
 * http://wiki.xmltv.org/index.php/XMLTVFormat
 */
class Epg {
    private channelTemplate : string;
    private programmeTemplate : string;
    private xmlContainer : string;
    private epgUrl: string = 'aHR0cHM6Ly9vbmxpbmUuZGlnaS5odS9hcGkvZXBnL2dldEVQR0FsbD9wbGF0Zm9ybT1BbmRyb2lkJmRhdGU9';
    private epgFile: string = './epg.xml'
    private epgTimeStampFile: string = './epg.timestamp';

    constructor () {
        /*
         * Template fájlok az xml generálásához
         */
        this.channelTemplate = '<channel id="id:id"><display-name lang="hu">:channelName</display-name></channel>\n';
        this.programmeTemplate = '<programme start=":start :startOffset" stop=":end :endOffset" channel="id:id"><title lang="hu">:programmeName</title><desc lang="hu">:programmeDesc</desc></programme>\n';
        this.xmlContainer = '<?xml version="1.0" encoding="utf-8" ?><tv>:content</tv>';
    }

    private getXmlContainer (content) {
        return this.xmlContainer
            .replace(':content', content);
    }

    private getChannelTemplate (id, channelName) {
        var channel = this.channelTemplate
            .replace(':id', id)
            .replace(':channelName', this.escapeXml(channelName));

        return channel;
    }

    private _applyTimeZoneCorrection (originalDate) {
        let correctDate = new Date(originalDate);

        // időzóna korrekció
        const offset = Common.getStaticTimeZoneOffset();
        correctDate.setHours(correctDate.getHours() - offset);

        return correctDate;
    }

    private getProgrammeTemplate (id, start, end, programmeName, programmeDesc) {
        var startCorrect = this._applyTimeZoneCorrection(start);

        var endCorrect = this._applyTimeZoneCorrection(end);

        // Nem lehet egyszerre egy csatornán egy másodpercben egy csatornának kezdete és vége, így kivontunk belőle 1 mp-et
        endCorrect.setMilliseconds(endCorrect.getMilliseconds() - 1000);

        return this.programmeTemplate
            .replace(':id', id)
            .replace(':start', this.formatDate(startCorrect))
            .replace(':end', this.formatDate(endCorrect))
            .replace(':programmeName', this.escapeXml(programmeName))
            .replace(':programmeDesc', this.escapeXml(programmeDesc))
            .replace(':startOffset', '+0100')
            .replace(':endOffset', '+0100')
            ;
    }

    private formatDate (date) {
        let d       = new Date(date);
        let year    = d.getFullYear();
        let month : any   = d.getMonth()+1;
        let day : any    = d.getDate();
        let hour : any   = d.getHours();
        let minute : any = d.getMinutes();
        let second : any = d.getSeconds();

        if (month.toString().length == 1) {
            month = '0' + month;
        }
        if (day.toString().length == 1) {
            day = '0'+day;
        }
        if (hour.toString().length == 1) {
            hour = '0'+hour;
        }
        if (minute.toString().length == 1) {
            minute = '0'+minute;
        }
        if (second.toString().length == 1) {
            second = '0'+second;
        }

        return '' + year+month+day+hour+minute+second;
    }

    // https://stackoverflow.com/questions/7918868/how-to-escape-xml-entities-in-javascript
    private escapeXml(unsafestr: string) {
        return unsafestr.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            }
        });
    }
    
    private downloadEPG(cb) {
        let headers = {
            'User-Agent': 'okhttp/3.12.1',
            'Content-Type' : 'text/json'
        };
        let date = new Date().toISOString().split('T')[0];

        request.get(atob(this.epgUrl) + date, { headers: headers },
            function (error, response, body) {
                if (!error && response.statusCode == 200){
                    cb(body);
                }
            }
        );
    }

    private saveEPG(epgChannels, epgPrograms) {
        let content = this.getXmlContainer(epgChannels + epgPrograms);
        fs.writeFileSync(this.epgFile, content);
        Log.write('EPG file rewrite successful');
        fs.writeFileSync(this.epgTimeStampFile, (new Date()).toString());
    }

    /**
     * Elektronikus programujságot generálunk
     */
    public generateEpg() {
        const self = this;

        let lastUpgrade;
        try {
            lastUpgrade = new Date(fs.readFileSync(this.epgTimeStampFile).toString());
        } catch (e) {
            lastUpgrade = new Date('2000-01-01');
        }

        // XML outdate idő órában számítva
        const diffTime = CONFIG.epg.timeout * 60 * 60;

        if (CONFIG.epg.forceUpdate) {
            Log.write('EPG force reloading...');
        } else if (Common.diffTime(new Date(), lastUpgrade) < diffTime) {
            Log.write('EPG is up-to-date');
            return;
        } else {
            Log.write('EPG reloading...');
        }
        FileHandler.writeFile(this.epgFile, '');


        if (typeof this.epgUrl !== 'undefined') {
            Log.write(`EPG processing...`);

            self.downloadEPG(response => {
                let epgChannels = '',
                epgPrograms = '';
                let epgData = JSON.parse(response);

                for (let i = 0; i < epgData.data.length; i++){
                    epgChannels += self.getChannelTemplate(epgData.data[i].id_stream, epgData.data[i].stream_name);

                    for (let j=0; j < epgData.data[i].epg.length; j++) {
                        let channelData = epgData.data[i].epg[j];
                        let programStartDate = new Date(channelData.start_ts * 1000);
                        let programEndDate = new Date(channelData.end_ts * 1000);
                        epgPrograms += self.getProgrammeTemplate(
                            epgData.data[i].id_stream,
                            programStartDate,
                            programEndDate,
                            channelData.program_name + ' ' + channelData.program_description,
                            channelData.program_description_l
                        );
                    }
                }
                
                this.saveEPG(epgChannels, epgPrograms);
            });
        }

        /**
         * XML újragyártása beállított időközönként
         */
        setTimeout(function () {
            Log.write('EPG updating...');
            self.generateEpg();
        }, CONFIG.epg.timeout * 60 * 60 * 1000);
    }
}

export default Epg;
