'use strict';

import axios from 'axios';
import * as querystring from 'querystring';

export function upload(apiKey:string, duration:number, title:string, content:string): Promise<string> {

    let query:string;

    if (duration <= 0) {
        query = querystring.stringify({
            api_key: apiKey,
            title: title,
        });
    } else {
        query = querystring.stringify({
            api_key: apiKey,
            duration: duration,
            title: title,
        });
    }

    var p = new Promise<string>((resolve, reject) => {
        axios.post("https://www.pastery.net/api/paste/?" + query, content)
        .then(response => resolve(response.data.url))
        .catch(error => {
            if (error.response) {
                return reject("Pastery API returned an error. Please check if your Pastery API key is correct (it can be found in the VSCode global settings).");
            }
            return reject(error);
        });
    });

    return p;
}
