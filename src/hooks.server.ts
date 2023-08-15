import type { Handle, HandleServerError } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

let user : Handle = async ({ event, resolve }) => {
    
  // Get client IP
  let clientAddress = event.getClientAddress()
  event.locals.formData = { "ip": clientAddress }

  return resolve(event);
}


export const handleError : HandleServerError = async ({ error, event }) => {
  // you can capture the `error` and `event` from the server

  // Get Session Cookie
  if (event.url.href.includes("indices") || event.url.href.includes("documents")) {
    let web3auth = event.cookies.get('web3auth')
    if ( web3auth === undefined ) {
      let message = "Verification expired or missing, please connect and sign in."
      return {
        // don't show sensitive data to the user
        message
      }
    }
  }
  console.log(error)
  
  return {
    // don't show sensitive data to the user
    message: 'Yikes! 💩'
  }
  }


export const handle = sequence(user)