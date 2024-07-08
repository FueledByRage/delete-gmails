import { executeDeleteRequest } from "./api.mjs";

process.on('message', async (data) => {
    const ids = data.map(message => message.id);
    executeDeleteRequest(ids);
});