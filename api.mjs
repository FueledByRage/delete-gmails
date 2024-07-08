import { get, request } from 'https';


const userId = '';
const accessToken = '';
const hostname = 'gmail.googleapis.com';

export async function listEmails(params) {
    let path = `/gmail/v1/users/${userId}/messages?maxResults=50`;

    Object.keys(params).forEach(key => {
        if(params[key] != undefined){
            path += `&${key}=${params[key]}`;
        }
    });

    const options = {
        hostname,
        port: 443,
        path,
        method: 'GET', 
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    };

    return new Promise((resolve, reject) => {
        get(options, (res) => {
            let dataResponse = '';

            res.on('data', chunk => {
                dataResponse += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(dataResponse));
            });
        }).on('error', (error) => {
            reject(error);
        });
    });
};

function getDeleteRequestOptions(ids){
    const options = {
        hostname,
        path: `/gmail/v1/users/${userId}/messages/batchDelete`,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Content-Length': JSON.stringify({ ids }).length,
        }
    };

    return options;
}

export async function executeDeleteRequest(ids) {
    const options = getDeleteRequestOptions(ids);

    const req = request(options, (res) =>{
        let dataResponse = '';

        res.on('data', (chunk) => {
            dataResponse += chunk;
        });

        res.on('end', () => {
            console.log(dataResponse);
            process.send('Batch delete request done.')
        });
    })
    
    req.on('error', (error) => {
        console.error(error);
    });

    const postData = JSON.stringify({ ids: ids });

    req.write(postData);
    req.end();
}