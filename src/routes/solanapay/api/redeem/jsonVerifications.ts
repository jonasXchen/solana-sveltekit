import * as fs from 'fs';

export let getFirstValueInArray = (filePath: string, mintKey: string, signerKey: string, signerString: string) : Promise<any> => {

    let firstValue : any
    // Read the JSON file
    const data = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(data);
  
    // Check if the specified array key exists in the JSON object
    if (json.hasOwnProperty(mintKey)) {
        // Get the array
        let mintArray = json[mintKey];
        let signerArray = json[signerKey]

        // Check if the array exists and has elements
        if (Array.isArray(mintArray) && mintArray.length > 0 && Array.isArray(signerArray) && !(signerArray.includes(signerString))) {
        // Get the first value in the array
        firstValue = mintArray[0];

        } else {
        console.error(`The specified array is empty or '${signerString}' already redeemed.`);
        }
    } else {
        console.error(`The key '${mintKey}' does not exist in the JSON object.`);
    }

    return firstValue
  }


export let verifyMintInJson = (filePath: string, mintKey: string, signerKey: string, signerString: string) : any => {

    let firstValue : any
    // Read the JSON file
    const data = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(data);
  
    // Check if the specified array key exists in the JSON object
    if (json.hasOwnProperty(mintKey)) {
        // Get the array
        let mintArray = json[mintKey];
        let signerArray = json[signerKey]

        // Check if the array exists and has elements
        if (Array.isArray(mintArray) && mintArray.length > 0 && Array.isArray(signerArray) && !(signerArray.includes(signerString)) ) {
            // Get the first value in the array
            firstValue = mintArray[0];


            // Remove the first element from the array
            mintArray.shift();
            // Append the new item to the array
            signerArray.push(signerString);

  
            // Convert the modified object back to a JSON string
            json[mintKey] = mintArray
            json[signerKey] = signerArray
  
            // Save the updated JSON string to the filesystem
            fs.writeFileSync(filePath, JSON.stringify(json, null, 2))

        } else {
        console.error(`The specified array is empty or '${signerString}' alreade redeemed.`);
        }
    } else {
        console.error(`The key '${mintKey}' does not exist in the JSON object.`);
    }
}
  