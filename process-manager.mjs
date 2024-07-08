import { fork } from 'child_process';

function roundRobin(processes, index = 0){
    return function (){
        if(index >= processes.length){
            index = 0;
        }

        return processes[index++];
    }
}

function initializeCluster({ clusterSize, onMessage }){
    let process = new Map();

    for(let i = 0; i < clusterSize; i++){
        const child = fork('infinity-snap.mjs');

        child.on('message', onMessage);

        process.set(child.pid, child);
    }

    return{
        getProcess: roundRobin([...process.values()]),
        killAll: () =>{
            process.forEach(child => child.kill());
        }
    };
}

export function snapThisShitOnInfinity({ clusterSize, onMessage }){
    const { getProcess, killAll } = initializeCluster({ clusterSize, onMessage });

    function sendToChild(data){
        const child = getProcess();

        child.send(data);
    }

    return{
        sendToChild: sendToChild.bind(this),
        killAll: killAll.bind(this),
    };
}