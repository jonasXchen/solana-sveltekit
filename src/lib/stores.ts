import { Connection, clusterApiUrl, type Cluster, } from '@solana/web3.js'
import { writable, type Writable } from "svelte/store";
import { browser } from "$app/environment";



// Export wallet cluster and cluster connection
let defaultCluster : Cluster = 'devnet'
export let cluster : Writable<Cluster> = writable(defaultCluster as Cluster)
export let connectedCluster = writable(new Connection(clusterApiUrl(defaultCluster), 'confirmed'))

// Check cluster and set local storage and store
let localStorageKeyForCluster = "cluster" 
let localCluster : Cluster | undefined 
if ( browser ) {
    localCluster = localStorage.getItem(localStorageKeyForCluster) as Cluster
}

// Subscribe for changes in store, and set local storage
cluster.subscribe((value: Cluster) => {
    if (localCluster as Cluster) {
        localStorage.setItem(localStorageKeyForCluster, value);
    }
});



// For Dark mode
export let theme : Writable<string> = writable("dark")

theme.subscribe((value: string) => {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem("theme", value);
    }
});


// Notifications
export const notifications = writable <string[]>([])
let notificationCounter = 0
export function notify (message: string) {
    message = "#" + (notificationCounter += 1) + ": " + message
    notifications.update((state) => [message, ...state ])
    
    setTimeout(removeNotification, 2000)
}
function removeNotification() {
    notifications.update( (state) => {
        state.pop()
        state.length == 0 ? notificationCounter = 0 : ''
        return state
    })
}