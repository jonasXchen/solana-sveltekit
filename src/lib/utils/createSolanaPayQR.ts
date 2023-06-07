import { encodeURL, createQR, type TransactionRequestURLFields, type TransferRequestURLFields } from '@solana/pay';
import type QRCodeStyling from '@solana/qr-code-styling';


export async function createTransferRequestQr( urlFields: TransferRequestURLFields, size: number | undefined = undefined, background: string | undefined = undefined, color: string | undefined = undefined) {

    let QR : QRCodeStyling
    let QR_str: string
    let url =  encodeURL(urlFields)

    QR = createQR(url, size, background, color)
    await QR._getElement()
    QR_str = QR._svg?.outerHTML as string

    return [ QR, QR_str, url ]
}


export async function createTxRequestQr( urlFields : any,  size: number | undefined = undefined, background: string | undefined = undefined, color: string | undefined = undefined) {

    let QR : QRCodeStyling
    let QR_str: string
    // let url =  encodeURL(urlFields)

    let params = new URLSearchParams();

    for (const key in urlFields) {
        if (urlFields.hasOwnProperty(key) && !(key==='link')) {
          params.append(key, urlFields[key]);
        }
    }
    
    const url = `solana:${urlFields['link']}?${params.toString()}`;

    QR = createQR(url, size, background, color)
    await QR._getElement()
    QR_str = QR._svg?.outerHTML as string

    return [ QR, QR_str, url ]
}