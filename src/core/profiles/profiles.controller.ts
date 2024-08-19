import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtService } from '@nestjs/jwt';
import { Express, Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProfilesService } from './profiles.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import * as uuid from 'uuid';

/**
 * [domen]/profiles
 */
@Controller('profiles')
export class ProfilesController {
  /**
   * Inject dependencies
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly profilesService: ProfilesService,
  ) {}

  /**
   * [domen]/profiles
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AccessTokenGuard)
  async findOne(@Req() req: Request) {
    /**
     * Decode refresh token
     */
    const { sub } = await this.jwtService.decode(req.cookies.accessToken);

    /**
     * Find and return profile
     */
    return await this.profilesService.findOne(sub);
  }

  /**
   * [domen]/profiles/image
   */
  @Post('/image')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      /**
       * Multer config
       */
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          /**
           * Generate file name
           */
          const imageName = uuid.v4();

          cb(null, `${imageName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadImage(@UploadedFile() image: Express.Multer.File, @Req() req: Request) {
    /**
     * Decode refresh token
     */
    const { sub } = await this.jwtService.decode(req.cookies.accessToken);

    /**
     * Upload and return profile image url
     */
    return this.profilesService.uploadImage(sub, image.filename);
  }
}
