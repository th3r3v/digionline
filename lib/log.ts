import CONFIG from "../config";
import FileHandler from "./file";
const findRemoveSync = require("find-remove");

class Log {
    public static write (...input) : void {
        const today = new Date();
        const isoDateString = today.toISOString().substring(0, 10);

        console.log((new Date()).toString(), input);
        
        if (CONFIG.log.level !== 'stdout') {
            FileHandler.appendFile(`log/${isoDateString}.log`, `${(new Date()).toString()} # ${JSON.stringify(input)}`);
        }
    }

    public static error (...input) : void {
        Log.write(`################# FATAL ERROR #############`);
        Log.write(...input);
        setTimeout(() => {
            process.exit();
        }, 2000);
    }

    public static janitor(): void {
        findRemoveSync("log/", { extensions: [".log"], age: { seconds: 604800 } });
        Log.write("Deleting log files which are older than 7 days successful");

        // naponta ismetlodhet
        setTimeout(function () {
            Log.janitor();
        }, 24 * 60 * 60 * 1000);
    }
}

export default Log;
