import { listEmails } from './api.mjs';
import { snapThisShitOnInfinity } from './process-manager.mjs';

const cluster = snapThisShitOnInfinity({
    clusterSize: 4,
    onMessage: (data) => {
        getEmails(data);
    }
});

async function* getEmails({ numberOfEmails, query, pageToken }){
    const { messages, nextPageToken } = await listEmails({  q: query, pageToken });

    if(!nextPageToken){
        cluster.killAll();
        console.log('No more emails to fetch!!');
        return;
    }

    yield messages;
    yield* getEmails({ numberOfEmails, query, pageToken: nextPageToken });
}

for await (const emails of getEmails({ numberOfEmails: 50, query: 'is:unread'})){
    cluster.sendToChild(emails);
    
    if(emails.length == 0){
        cluster.killAll();
    }
}

