import { encodeURL, createQR, type TransferRequestURLFields } from '@solana/pay';
import type QRCodeStyling from '@solana/qr-code-styling';


export let createTransferRequestQr = async ( urlFields: TransferRequestURLFields, size: number | undefined = undefined, background: string | undefined = undefined, color: string | undefined = undefined) => {

    let QR : QRCodeStyling
    let QR_str: string
    let url =  encodeURL(urlFields)

    QR = createQR(url, size, background, color)
    await QR._getElement()
    QR_str = QR._svg?.outerHTML as string

    return [ QR, QR_str, url ]
}


export let createTxRequestQr = async ( urlFields : any,  size: number | undefined = undefined, background: string | undefined = undefined, color: string | undefined = undefined) => {

    let QR : QRCodeStyling
    let QR_str: string
    let endpoint : string = encodeURIComponent(String(urlFields['link']).replace(/\/\?/, '?'))

    // Get Params
    let params = new URLSearchParams();
    for (const key in urlFields) {
        if (urlFields.hasOwnProperty(key) && !(key==='link')) {
          params.append(key, urlFields[key]);
        } else if ((urlFields.hasOwnProperty(key) && (key==='link'))) {

        }
    }

    let url = `solana:${endpoint}%3F${params.toString()}`;

    QR = createQR(url, size, background, color)
    await QR._getElement()
    QR_str = QR._svg?.outerHTML as string

    return [ QR, QR_str, url ]
}