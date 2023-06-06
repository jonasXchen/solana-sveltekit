import { writable, type Writable } from 'svelte/store';
import { setContext, getContext } from "svelte";
import { Connection, clusterApiUrl, type Cluster, type Commitment } from '@solana/web3.js'; 

export function setConnection (cluster: Cluster, custom?: string, commitment?: Commitment) {
    let connection : Writable<Connection>

    if (custom) {
        connection = writable(new Connection(custom, commitment))
    } else {
        // connection = writable(new Connection(clusterApiUrl(cluster), commitment))
        connection = writable(new Connection('http://127.0.0.1:8899', 'confirmed'))
    }

    setContext('connection', connection)

}

export function getConnection () {
    return getContext<Writable<Connection>>('connection')
}

