import * as fs from 'fs';

export interface LoadMetaOptions {
    location: string
}
export async function loadMetaInformation({
    location
}: LoadMetaOptions) {
    try {
        const data = fs.readFileSync(location, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData;
    } catch(e) {
        console.error(e);
        throw new Error("Could not load metadata");
    }
}
export interface WriteMetaOptions {
    location: string,
    data: Record<any, any>
}
export function writeMetaInformation({
    location, 
    data
}: WriteMetaOptions) {
    fs.writeFileSync(location, JSON.stringify(data));
    const readData = fs.readFileSync(location, {encoding: 'utf8'});
    const json = JSON.parse(readData);
    console.error(readData);
    console.error(json == data);
}