import type { PageServerLoad } from './$types'
import type { Actions } from '@sveltejs/kit'

import { getIndexDetails, putMappings } from "$lib/utils/elasticsearch";
import { verifyCookie } from '$lib/utils/web3Authorize';
import { admins } from '$lib/server/admin';

export let load : PageServerLoad = async (event) => {

    let web3auth = JSON.parse(event.cookies.get("web3auth")!)
    let verified = await verifyCookie(web3auth)

    let index
    let indexDetails
    if (verified && admins.includes(web3auth.publicKey)) {
        index = event.params.index
        indexDetails = await getIndexDetails(index)
    }
    
    return { index, indexDetails }
}


export let actions: Actions = {

    putMappings: async ( { request } ) => {

        const formData = await request.formData()
        const index = String(formData.get('index'))
        const body = JSON.parse(String(formData.get('body')).replace(/\r?\n|\r|\s|\t/g, ""))
        const response = await putMappings(index, body)

        return { success: true }
        
    }

}