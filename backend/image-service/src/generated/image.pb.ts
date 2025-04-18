// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.181.2
//   protoc               v5.29.3
// source: image.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "image";

export interface UploadImageRequest {
  metadata?: ImageMetadata | undefined;
  chunk?: Uint8Array | undefined;
}

export interface ImageMetadata {
  filename: string;
  contentType: string;
  userId: string;
}

export interface UploadImageResponse {
  success: boolean;
  message: string;
  imageId: string;
  originalImageUrl: string;
  image: ImageInfo | undefined;
}

export interface GetImageByIdRequest {
  imageId: string;
}

export interface ImageInfo {
  id: string;
  originalName: string;
  filePath: string;
  processingStatus: string;
  dimensions: ImageDimensions | undefined;
  userId: string;
  uploadDate: string;
  optimizedPath: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface GetImageRequest {
  imageId: string;
}

export interface GetImageResponse {
  success: boolean;
  message: string;
  imageData: Uint8Array;
  contentType: string;
}

export const IMAGE_PACKAGE_NAME = "image";

export interface ImageServiceClient {
  uploadImage(request: Observable<UploadImageRequest>): Observable<UploadImageResponse>;

  getImageById(request: GetImageByIdRequest): Observable<ImageInfo>;

  getOriginalImage(request: GetImageRequest): Observable<GetImageResponse>;

  getOptimizedImage(request: GetImageRequest): Observable<GetImageResponse>;
}

export interface ImageServiceController {
  uploadImage(
    request: Observable<UploadImageRequest>,
  ): Promise<UploadImageResponse> | Observable<UploadImageResponse> | UploadImageResponse;

  getImageById(request: GetImageByIdRequest): Promise<ImageInfo> | Observable<ImageInfo> | ImageInfo;

  getOriginalImage(
    request: GetImageRequest,
  ): Promise<GetImageResponse> | Observable<GetImageResponse> | GetImageResponse;

  getOptimizedImage(
    request: GetImageRequest,
  ): Promise<GetImageResponse> | Observable<GetImageResponse> | GetImageResponse;
}

export function ImageServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["getImageById", "getOriginalImage", "getOptimizedImage"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ImageService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = ["uploadImage"];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ImageService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const IMAGE_SERVICE_NAME = "ImageService";
