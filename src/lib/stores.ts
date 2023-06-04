import { Connection, clusterApiUrl } from '@solana/web3.js'
import { writable } from "svelte/store";


// Export wallet cluster and cluster connection
export let cluster : any
export let connectedCluster = writable( new Connection(clusterApiUrl('devnet'), 'confirmed') )

if (typeof localStorage !== 'undefined') {
    let storedCluster = localStorage.getItem("cluster");
    cluster = writable(storedCluster);
} else {
    cluster = writable('devnet')
}

cluster.subscribe((value: string) => {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem("cluster", value);
    }
});



// For Dark mode
export let theme : any;

if (typeof localStorage !== 'undefined') {
    let storedTheme = localStorage.getItem("theme");
    theme = writable(storedTheme);
} else {
    theme = writable("dark")
}

theme.subscribe((value: string) => {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem("theme", value);
    }
});


// Notifications
type Notification = string
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