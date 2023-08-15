import type { PageServerLoad } from './$types'
import type { Actions } from '@sveltejs/kit'

import { createIndex, deleteIndex, getIndexDetails, getIndices } from "$lib/utils/elasticsearch";
import { verifyCookie } from '$lib/utils/web3Authorize';
import { admins } from '$lib/server/admin';

export let load : PageServerLoad = async (event) => {

    let web3auth = JSON.parse(event.cookies.get("web3auth")!)
    let verified = await verifyCookie(web3auth)

    let indices
    if (verified && admins.includes(web3auth.publicKey)) {
        indices = await getIndices()
    }
    
    return { indices }
}

export let actions: Actions = {
    createIndex: async ( { request } ) => {

        const formData = await request.formData()
        const index = String(formData.get('index'))
        const body = JSON.parse(String(formData.get('body')).replace(/\r?\n|\r|\s|\t/g, ""))
        const response = await createIndex(index, body)

        return { success: true }
        
    },
    deleteIndex: async ( { request } ) => {
        const formData = await request.formData()
        const index = String(formData.get('index'))
        const response = await deleteIndex(index)

        return { success: true }
        
    }
}