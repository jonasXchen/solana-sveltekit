export interface Member {
    pubkey: string,
    username: string,
    status?: Status,
    email?: string,
    socials?: {
        twitter?: string,
        discord?: string,
        linkedin?: string
    },
    address?: {
        firstname?: string,
        lastname?: string,
        country?: string,
        city?: string,
        postcode?: string,
    }
    location?: {
        latitude: number,
        longitude: number
    },
    profession?: {
        company: string,
        role: string
    },
    ip?: string,
}

enum Status {
    added,
    approved,
    disapproved,
    removed
}

let members: Member[] = [
    {
        pubkey: 'pubkey.asdlfjkasd',
        username: "tas",
        status: Status.added,
        socials: {
            linkedin: '',
            twitter: ''
        }
    }
]

export function getMembers() {
    return members
}

export const addMember = (form: Member) => {

    console.log(form)

    const member: Member = {
        pubkey: form.pubkey,
        username: form.username,
        status: Status.added,
        ip: form.ip
    }
    members.push(member)
}

export const editMember = (pubkey: string) => {
}

export const removeMember = (pubkey: string) => {
    console.log(pubkey)
    members = members.filter( (member) => member.pubkey !== pubkey)
    console.log(members)
}

export const approveMember = (pubkey: string) => {
    members = []
}

export const disapproveMember = (pubkey: string) => {
    members = []
}

export const clearMembers = () => {
    members = []
}