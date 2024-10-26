import CryptoJS from 'crypto-js'
import { KEY } from "./constant.js";

export async function receiveMessage(messageStr="{type:'',data:{}}") {
    return JSON.parse(messageStr)
}

export function sendMessage(messageObj={type:'',data:{}}){
    return JSON.stringify(messageObj)
}

export function encrypt(text) {
    return CryptoJS.AES.encrypt(text, KEY).toString();
}

export function decrypt(encryptedText) {
    const bytes = CryptoJS.AES.decrypt(encryptedText, KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}