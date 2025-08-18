import { keys,get, del} from 'idb-keyval';
import { UploadsInfoTypes } from '@/app/types/upload.types';

export const getIndexedDB = async():Promise<UploadsInfoTypes[]> => {
        const fileNames = await keys();
        const files = await Promise.all(
            fileNames.map((item) => get<UploadsInfoTypes>(item))
        );
        return files.filter((f): f is UploadsInfoTypes => f !== undefined)
};

export const removeFile = async(id:string)=>{
    await del(id);
}