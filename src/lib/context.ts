import { writable, type Writable } from 'svelte/store';
import { setContext, getContext } from "svelte";
import { Connection, clusterApiUrl, type Cluster, type Commitment } from '@solana/web3.js'; 

export function setConnection (cluster: Cluster, custom?: string, commitment?: Commitment) {
    let connection : Writable<Connection>

    if (custom) {
        connection = writable(new Connection(custom, commitment))
    } else {
        connection = writable(new Connection(clusterApiUrl(cluster), commitment))
    }

    setContext('connection', connection)

}

export function getConnection () {
    return getContext<Writable<Connection>>('connection')
}

