import { json, type RequestHandler } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export function GET(event : any) {
    // log all headers
    console.log(...event.request.headers);
    console.log(event.url.searchParams.get('test'))

    return json({
        // retrieve a specific header
        userAgent: event.request.headers.get('user-agent')
    });
}

/** @type {import('./$types').RequestHandler} */
export async function POST(event : any) {
    const body = await event.request.formData();
   

    // log all fields
    console.log([...body]);

    return json({
        // get a specific field's value
        name: body.get('name') ?? 'world'
    });
}
