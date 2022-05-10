import Server from './Server';
import { imageFileCheck } from '../utils';
import Cookies from 'universal-cookie';
import { ITable } from '../utils/types/table';
import { IPhoto } from '../utils/types/Photo';
import { IMessage } from '../utils/types/Message';
import { IPagination } from '../utils/types/Pagination';

const cookies = new Cookies();
export default class PhotoService {
  static uploadImage(
    title: string,
    imageFile: File,
    handleSuccess: () => void,
    handleError: (errorMessage: string) => void
  ) {
    if (!imageFileCheck(imageFile, handleError)) return;
    const userInfos = cookies.get('user');
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('title', title);
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: userInfos?.token
      },
      body: formData
    };
    return Server.request(
      `/photo/upload`,
      requestOptions,
      handleSuccess,
      handleError
    );
  }
  static getData(
    pageSize: number,
    page: number,
    handleSuccess: (pagination: IPagination) => void,
    handleError: (errorMessage: string) => void
  ) {
    const URL = `/photo/infos?pageSize=${encodeURIComponent(
      pageSize
    )}&page=${encodeURIComponent(page)}`;
    const userInfos = cookies.get('user');
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfos?.token
      }
    };
    const successFunction = (val: string) => {
      handleSuccess(JSON.parse(val));
    };
    const errorFunction = (errorMessage: string) => {
      handleError(JSON.parse(errorMessage).message);
    };
    return Server.request(URL, requestOptions, successFunction, errorFunction);
  }

  static downloadImage(
    id: number,
    handleSuccess: (photo: IPhoto) => void,
    handleError: (errorMessage: IMessage) => void
  ) {
    const URL = `/photo/download`;
    const userInfos = cookies.get('user');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfos?.token
      },
      body: JSON.stringify({
        id
      })
    };
    const successFunction = (photo: string) => {
      handleSuccess(JSON.parse(photo));
    };
    const failFunction = (errorMessage: string) => {
      handleError(JSON.parse(errorMessage));
    };
    return Server.request(URL, requestOptions, successFunction, failFunction);
  }
}
