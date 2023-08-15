import { json } from '@sveltejs/kit'
import type { RequestHandler } from "@sveltejs/kit";

import { getIndexDetails } from "$lib/utils/elasticsearch";

export const POST : RequestHandler = async ({ request }) => {

    let body = await request.json()

    let indexDetails = await getIndexDetails(body.index)

    if ("index" in indexDetails.settings && "analysis" in indexDetails.settings.index) {
        indexDetails.settings = { 
            "index": {
                "analysis": indexDetails.settings.index.analysis
            }
        }
    } else {
        indexDetails.settings = {}
    }

    return json(indexDetails)
}