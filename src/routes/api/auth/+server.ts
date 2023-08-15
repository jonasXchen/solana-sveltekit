import { verifyMessageSignature } from '$lib/utils/web3Authorize';
import { json } from '@sveltejs/kit'
import type { RequestHandler } from "@sveltejs/kit";



export const POST : RequestHandler = async ({ request, cookies }) => {


    let body = await request.json()
    let signStatus = false

    if (body.action == "signin") {

        // Get values from request
        let publicKey = body.publicKey
        let message = body.message
        let signature = body.signature
        let authorizedDate = new Date(body.authorizedDate) as Date

        let { verified } = verifyMessageSignature(message, signature, publicKey)

        if (verified) {
            let jsonString = JSON.stringify({
                "signature": signature,
                "message": message,
                "publicKey": publicKey,
            })

            cookies.set("web3auth", jsonString, { path: '/', expires: authorizedDate })
            signStatus = true
        }

    } else {
        cookies.set("web3auth", "", { path: '/', expires: new Date(0) })
        signStatus = false
    }


    return json( { signStatus } )
}

