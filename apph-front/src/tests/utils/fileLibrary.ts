import { createEvent, fireEvent } from '@testing-library/react';

export function inputFile(file: File, input: HTMLInputElement) {
  fireEvent(
    input,
    createEvent('input', input, {
      target: { files: [file] }
    })
  );
}

export function fakeFile(size: number, type: string) {
  const file = new File([''], 'big_image.png', { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

export function fakeUploadRequestParams(file: File, title: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', title);
  const requestOptions = {
    method: 'POST',
    body: formData
  };
  return { URL: `/photo/upload`, requestOptions };
}
