import { Client } from '@elastic/elasticsearch'
import { PRIVATE_ELASTICSEARCH_ID, PRIVATE_ELASTICSEARCH_SECRET, PRIVATE_ELASTICSEARCH_ENDPOINT } from '$env/static/private'
import type { CatIndices, Search } from '@elastic/elasticsearch/api/requestParams'
import { parse } from "csv-parse";

const client = new Client({
  node: PRIVATE_ELASTICSEARCH_ENDPOINT, 
  auth: {
    apiKey: { 
      id: PRIVATE_ELASTICSEARCH_ID,
      api_key: PRIVATE_ELASTICSEARCH_SECRET,
    }
  }
})

// INDEX LEVEL
export let createIndex = async (index: string, body: Record<string, any> = {}) => {

    let response = await client.indices.create({
        index, 
        body
    })

    return response
}

export let deleteIndex = async (index: string) => {
    let response = await client.indices.delete({
        index
    })
    return response
}

export let getIndices = async () => {

    let indices = await client.cat.indices( {
        format: 'json',
        s: 'index'
    })
    
    return indices.body as CatIndices[]
}

export let getIndexDetails = async (index: string) => {

    let mappings = await getMappings(index)
    let settings = await getSettings(index)
    let aliases = await getAlias(index)

    return { aliases, settings, mappings }
}


export let getMappings = async (index: string) => {

    let mappings
    try {
        let response = await client.indices.getMapping( { index } )
        mappings = response.body[index].mappings
    } catch {
        mappings = {}
    }

    return mappings 
}

export let putMappings = async (index: string, body: Record<string, any>) => {

    let mappings
    try {
        let response = await client.indices.putMapping( { index, body } )
        console.log(response)
        mappings = response.body[index].mappings
    } catch {
        mappings = {}
    }
    console.log(mappings)

    return mappings 
}




export let getSettings = async (index: string) => {

    let settings
    try {
        let response = await client.indices.getSettings( { index } )
        settings = response.body[index].settings
    } catch {
        settings = {}
    }

    return settings 
}

export let getAlias = async (index: string) => {

    let aliases
    try {
        let response = await client.indices.getAlias( { index } )
        aliases = response.body[index].aliases
    } catch {
        aliases  = {}
    }

    return aliases
}



// DOCUMENT LEVEL
export let indexDocument = async (index: string, id: string, body: Record<string, any>) => {
    const response = await client.index(
        {
            index,
            id,
            body,
            refresh: true
        })
    return response
}


export let getDocuments = async (index: string, id: string) => {
    const response = await client.get({
        index,
        id
    })
    return response
}

export let getAllDocumentsByIndex = async (index: string, size: number = 100, query?: Record<string,any> ) => {

    const response = await client.search(
        {
            index,
            size,
            body: {
                sort: { "@timestamp" : {"order" : "desc", "format": "strict_date_optional_time_nanos"}},
                query: query
            }
        }
    )
    return response
}

export let searchDocuments = async (query: Search) => {
    const response = await client.search(query)
    return response
}

export let updateDocuments = async (index: string, id: string, body: Record<string, any>) => {
    const response = await client.update({
        index,
        id,
        body
    })
    return response
}

export let deleteDocument = async (index: string, id: string) => {
    const response = await client.delete({
        index,
        id,
        refresh: true
    })
    return response
}




// the main function takes a csv file and send it to elasticsearch
export let indexCsv = async (index: string, csvFile: File) => {

    const csvBuffer = Buffer.from(await csvFile.arrayBuffer()).toString('utf-8')
    const parser = parse(csvBuffer, {
      columns: true,
      skip_empty_lines: true,
    });
    const records = [];
    for await (const record of parser) {
      records.push(record);
    }
  
    const body = records.flatMap((doc) =>
        [{ index: { _index: index, _id: doc['id'] } }, doc]
        );
    
    const batchSize = 1000
    let batchNumber = 0
    const erroredDocuments : any[] = [];
    while (batchNumber < Math.ceil(body.length / batchSize)) {
        let batch = body.slice(batchNumber * batchSize, (batchNumber + 1) * batchSize);
        let { body: bulkResponse } = await client.bulk({ refresh: true, body: batch });
        batchNumber++
        
        if (bulkResponse.errors) {
          bulkResponse.items.forEach((action: any, i: any) => {
            let operation = Object.keys(action)[0];
            console.log(action[operation])
            if (action[operation].error) {
              erroredDocuments.push({
                status: action[operation].status,
                error: action[operation].error,
                operation: body[i * 2],
                document: body[i * 2 + 1],
              });
            }
          });
        }

    }
  
    const { body: countBody } = await client.count({ index });
    return {
      count: countBody.count,
      erroredDocuments,
    };
  }