/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError, throwError } from 'rxjs';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data';

type InfraCategory =
  | 'SCHOOL'
  | 'HOSPITAL'
  | 'PARK'
  | 'MARKET'
  | 'UTILITY'
  | 'ADMINISTRATIVE'
  | 'OTHER';

interface UploadFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

@Injectable()
export class InfrastructuresService {
  private readonly gisServerUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const url = this.configService.get<string>('GIS_SERVER_URL');
    if (!url) {
      throw new Error('GIS_SERVER_URL is not defined in environment variables');
    }
    this.gisServerUrl = url;
  }

  private handleError(error: AxiosError) {
    console.error('Error from GIS Server:', error.response?.data);
    return throwError(
      () =>
        new HttpException(
          error.response?.data ||
            'An internal error occurred in the GIS Server',
          error.response?.status || 500,
        ),
    );
  }

  async create(createDto: any) {
    const url = `${this.gisServerUrl}/infrastructures`;
    const response = await firstValueFrom(
      this.httpService.post(url, createDto).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async findAll(districtId?: string, category?: InfraCategory) {
    const url = `${this.gisServerUrl}/infrastructures`;
    const response = await firstValueFrom(
      this.httpService
        .get(url, { params: { districtId, category } })
        .pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async findOne(id: string) {
    const url = `${this.gisServerUrl}/infrastructures/${id}`;
    const response = await firstValueFrom(
      this.httpService.get(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async update(id: string, updateDto: any) {
    const url = `${this.gisServerUrl}/infrastructures/${id}`;
    const response = await firstValueFrom(
      this.httpService.patch(url, updateDto).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async remove(id: string) {
    const url = `${this.gisServerUrl}/infrastructures/${id}`;
    const response = await firstValueFrom(
      this.httpService.delete(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async findWithinRadius(lng: string, lat: string, radiusInMeters: string) {
    const url = `${this.gisServerUrl}/infrastructures/within-radius`;
    const response = await firstValueFrom(
      this.httpService
        .get(url, { params: { lng, lat, radiusInMeters } })
        .pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async uploadImages(files: UploadFile[]) {
    const url = `${this.gisServerUrl}/infrastructures/upload`;
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file.buffer, {
        filename: file.originalname as string,
        contentType: file.mimetype as string,
      });
    });
    const response = await firstValueFrom(
      this.httpService
        .post(url, formData, {
          headers: {
            ...formData.getHeaders(),
          },
        })
        .pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async setImages(infraId: string, imagesData: any) {
    const url = `${this.gisServerUrl}/infrastructures/${infraId}/images`;
    const response = await firstValueFrom(
      this.httpService.post(url, imagesData).pipe(catchError(this.handleError)),
    );
    return response.data;
  }

  async deleteImage(infraId: string, imageId: string) {
    const url = `${this.gisServerUrl}/infrastructures/${infraId}/images/${imageId}`;
    const response = await firstValueFrom(
      this.httpService.delete(url).pipe(catchError(this.handleError)),
    );
    return response.data;
  }
}
