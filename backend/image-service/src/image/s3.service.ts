import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class S3Service {
  private s3: AWS.S3;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get("AWS_ACCESS_KEY_ID", "minioadmin"),
      secretAccessKey: this.configService.get(
        "AWS_SECRET_ACCESS_KEY",
        "minioadmin"
      ),
      endpoint: this.configService.get(
        "AWS_S3_ENDPOINT",
        "http://localhost:9000"
      ),
      s3ForcePathStyle: true,
      signatureVersion: "v4",
    });
  }

  async uploadFile(
    file: Buffer,
    originalName: string,
    contentType: string,
    folder: string = "original"
  ): Promise<string> {
    const bucket = this.configService.get("AWS_S3_BUCKET", "images");
    const key = `${folder}/${uuidv4()}-${originalName}`;

    const params = {
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: "public-read",
    };

    const result = await this.s3.upload(params).promise();
    return result.Location;
  }

  async getFileUrl(key: string): Promise<string> {
    if (!key) {
      throw new Error("File key is required");
    }
    const bucket = this.configService.get("AWS_S3_BUCKET", "images");
    const params = {
      Bucket: bucket,
      Key: key,
      Expires: 3600, 
    };
    return this.s3.getSignedUrlPromise("getObject", params);
  }

  async deleteFile(key: string): Promise<void> {
    const bucket = this.configService.get("AWS_S3_BUCKET", "images");
    const params = {
      Bucket: bucket,
      Key: key,
    };

    await this.s3.deleteObject(params).promise();
  }

  getPublicUrl(key: string): string {
    const bucket = this.configService.get("AWS_S3_BUCKET", "images");
    const endpoint = this.configService.get(
      "AWS_S3_ENDPOINT",
      "http://localhost:9000"
    );
    return `${endpoint}/${bucket}/${key}`;
  }
}
