import type { PageServerLoad } from './$types'

import { addMember, editMember, getMembers, removeMember, clearMembers, approveMember, disapproveMember } from '../../../lib/server/members'
import { fail, type Actions } from '@sveltejs/kit'

import { z } from 'zod'

import { createIndex, deleteIndex } from "$lib/utils/elasticsearch";

export const load : PageServerLoad = async (event) => {
    console.log('test1')
    const members = getMembers()
    console.log('test2')
    const clientAddress = event.getClientAddress()
    
    return { members, clientAddress }
}

const sleep = async (ms:number) => {
    return new Promise((resolve) => setTimeout( resolve, ms ) )
}

export const actions: Actions = {
    addIndex: async ( { request } ) => {
        const formData = await request.formData()
        const index = String(formData.get('index'))

        const response = await createIndex(index)

        return { success: true }
        
    },
    deleteIndex: async ( { request } ) => {
        const formData = await request.formData()
        const index = String(formData.get('index'))

        const response = await deleteIndex(index)

        return { success: true }
        
    },
    addMember: async ( { request } ) => {

        const formPayload = await request.formData()
        const formPayloadObject = Object.fromEntries(formPayload)

        const ACCEPTED_IMAGE_TYPES = [ "image/jpeg", "image/jpg", "image/png", "image/webp"]
        const MAX_FILE_SIZE = 3000000

        const addMemberSchema = z.object({
            pubkey: z.string().min(32).max(44),
            username: z.string().min(3),
            ip: z.string().ip()
        })


        const result = addMemberSchema.safeParse(formPayloadObject)
        console.log('result:', result)

        if (!result.success) {
            const data = {
                data: formPayloadObject,
                errors: result.error.flatten().fieldErrors
            }
            console.log(data)
            return fail(400, data)
        }

        console.log('sleeping')
        await sleep(2000)


        addMember({ 
            pubkey: result.data.pubkey,
            username: result.data.username,
            ip: result.data.ip,
            socials: {
                linkedin: '',
                twitter: ''
            }
            // image: {
            //     name: result.data.image.name,
            //     type: result.data.image.type,
            //     size: result.data.image.size,
            //     lastModified: result.data.image.lastModified,
            //     data: imageString
            // }
        })


        return { success: true }
    },
    editMember: async ( {request} ) => {
        const formData = await request.formData()
        const member = String(formData.get('pubkey'))
        editMember(member)
        return { success: true }
    },
    removeMember: async ( {request} ) => {
        const formData = await request.formData()
        console.log(formData)
        const member = String(formData.get('pubkey'))
        removeMember(member)
        return { success: true }
    },
    clearMembers: () => {
        clearMembers()
    },
    approveMember: async ( {request} ) => {
        const formData = await request.formData()
        const member = String(formData.get('pubkey'))
        approveMember(member)
        return { success: true }
    },
    disapproveMember: async ( {request} ) => {
        const formData = await request.formData()
        const member = String(formData.get('pubkey'))
        disapproveMember(member)
        return { success: true }
    },
}