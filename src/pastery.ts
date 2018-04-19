'use strict';

import axios from 'axios';
import * as querystring from 'querystring';

export function upload(apiKey:string, duration:number, title:string, content:string): Promise<string> {

    var query = querystring.stringify({
        api_key: apiKey,
        duration: duration,
        title: title,
    });

    var p = new Promise<string>((resolve, reject) => {
        axios.post("https://www.pastery.net/api/paste/?" + query, content)
        .then(response => resolve(response.data.url))
        .catch(error => reject(error));
    });

    return p;
}
