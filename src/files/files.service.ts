import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';


@Injectable()
export class FilesService {

    getStaticImage(image:string){
        const path=join(__dirname,'../../static/images',image);
        if (!existsSync(path)) throw new BadRequestException(`No file found with ${image}`)
        return path;
    }

}
