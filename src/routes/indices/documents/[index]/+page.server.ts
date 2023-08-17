import type { PageServerLoad } from './$types'
import type { Actions } from '@sveltejs/kit'

import { getAllDocumentsByIndex, indexDocument, deleteDocument, indexCsv } from "$lib/utils/elasticsearch";
import { verifyCookie } from '$lib/utils/web3Authorize';
import { admins } from '$lib/server/admin';


export let load : PageServerLoad = async (event) => {

    let web3auth = JSON.parse(event.cookies.get("web3auth")!)
    let verified = await verifyCookie(web3auth)
    
    let documents
    let path
    if (verified && admins.includes(web3auth.publicKey)) {
        path = event.params.index
        let response = await getAllDocumentsByIndex(path)
        documents = response.body.hits.hits
    }

    return { path, documents}
}

export let actions: Actions = {
    indexDocument: async ( { request, params } ) => {

        const formData = await request.formData()
        const index = params.index
        const id = String(formData.get('id')) ?? undefined
        const body = JSON.parse(String(formData.get('body')))
        const response = await indexDocument(index!, id, body)

        console.log(response)

        return { success: true }

    },
    deleteDocument: async ( { request, params } ) => {
        const formData = await request.formData()
        const index = params.index
        const id = String(formData.get('id'))
        const response = await deleteDocument(index!, id)

        console.log(response)

        return { success: true }
        
    },
    indexCsv: async ( { request, params } ) => {

        const formData = await request.formData()
        const index = params.index
        const file = formData.get('file') as File
        const response = await indexCsv(index!, file)
        
        console.log(response)

        return { success: true }

    },
}