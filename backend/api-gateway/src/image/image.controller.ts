import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Req,
  Res,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from "@nestjs/swagger";
import { Subject } from "rxjs";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ImageService } from "./image.service";
import {
  UploadImageRequest,
  UploadImageResponse,
} from "../generated/image.pb";
import { Response } from "express";

@ApiTags("images")
@Controller("images")
@UseGuards(JwtAuthGuard)
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
  @Post("upload")
  @ApiOperation({ summary: "Upload an image" })
  @ApiResponse({ status: 201, description: "Image uploaded successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        image: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor("image"))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any
  ) {
    if (!file) {
      throw new HttpException("No file uploaded", HttpStatus.BAD_REQUEST);
    }
  
    try {
      const subject = new Subject<UploadImageRequest>();
      const uploadObservable = this.imageService.uploadImage(subject);
  
      const responsePromise = new Promise<UploadImageResponse>(
        (resolve, reject) => {
          uploadObservable.subscribe({
            next: resolve,
            error: reject,
          });
        }
      );
  
      subject.next({
        metadata: {
          filename: file.originalname,
          contentType: file.mimetype,
          userId: req.user.id,
        },
      });
  
      const chunkSize = 64 * 1024;
      for (let i = 0; i < file.buffer.length; i += chunkSize) {
        const chunk = file.buffer.slice(i, i + chunkSize);
        subject.next({
          chunk: new Uint8Array(chunk),
        });
      }
  
      subject.complete();
      const response = await responsePromise;
  
      if (!response.success) {
        throw new HttpException(response.message, HttpStatus.BAD_REQUEST);
      }
      
      return {
        success: true,
        message: response.message,
        image: response.image,
        originalImageUrl: response.originalImageUrl,
      };
      
    } catch (error: any) {
      throw new HttpException(
        error?.message || "Failed to upload image",
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id")
  @ApiOperation({ summary: "Get image by ID" })
  @ApiResponse({
    status: 200,
    description: "Image information retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Image not found" })
  @ApiBearerAuth()
  async getImageById(@Param("id") id: string) {
    try {
      const image = await this.imageService.getImageById(id);
      if (!image) {
        throw new HttpException("Image not found", HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        image: {
          id: image.id || "",
          processingStatus: image.processingStatus || "PENDING",
          originalName: image.originalName || "Unknown",
          filePath: image.filePath || "",
          uploadDate: image.uploadDate || new Date().toISOString(),
          optimizedPath: image.optimizedPath || "",
          dimensions: image.dimensions || { width: 0, height: 0 },
          userId: image.userId || "",
        },
      };
    } catch (error: any) {
      throw new HttpException(
        error?.message || "Failed to get image",
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id/original")
  @ApiOperation({ summary: "Get original image by ID" })
  @ApiResponse({
    status: 200,
    description: "Original image retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Original image not found" })
  @ApiBearerAuth()
  async getOriginalImage(@Param("id") id: string, @Res() res: Response) {
    try {
      const response = await this.imageService.getOriginalImage(id);
      if (!response.success || !response.imageData?.length) {
        throw new HttpException(
          response.message || "No image data available",
          HttpStatus.NOT_FOUND
        );
      }
      res.set(
        "Content-Type",
        response.contentType || "application/octet-stream"
      );
      return res.send(Buffer.from(response.imageData));
    } catch (error: any) {
      throw new HttpException(
        error?.message || "Failed to get original image",
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(":id/optimized")
  @ApiOperation({ summary: "Get optimized image by ID" })
  @ApiResponse({
    status: 200,
    description: "Optimized image retrieved successfully",
  })
  @ApiResponse({ status: 404, description: "Optimized image not found" })
  @ApiBearerAuth()
  async getOptimizedImage(@Param("id") id: string, @Res() res: Response) {
    try {
      const response = await this.imageService.getOptimizedImage(id);
      if (!response.success) {
        throw new HttpException(response.message, HttpStatus.NOT_FOUND);
      }

      if (response.imageData?.length) {
        res.set("Content-Type", response.contentType || "image/webp");
        return res.send(Buffer.from(response.imageData));
      } else {
        throw new HttpException(
          "No image data or URL available",
          HttpStatus.NOT_FOUND
        );
      }
    } catch (error: any) {
      throw new HttpException(
        error?.message || "Failed to get optimized image",
        error?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
