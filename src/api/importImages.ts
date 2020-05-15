import { ImageType } from 'src/types/Image';
import id from 'src/utils/id';

type API = {
  galleryImages: ImageType[];
};

export default (url: string): Promise<ImageType[]> =>
  fetch(url)
    .then((response) => {
      const contentType = response.headers.get('content-type');

      return contentType && contentType.includes('application/json') ? response.json() : response.blob();
    })
    .then((data) => {
      if (data.galleryImages && Array.isArray(data.galleryImages)) {
        const { galleryImages } = data as API;

        return [...galleryImages.map((item) => ({ id: id(), ...item }))];
      }

      if (data.type.includes('image')) {
        const img = new Image();

        img.src = URL.createObjectURL(data);

        return new Promise((resolve, reject) => {
          img.addEventListener('load', () => {
            resolve([{ url, id: id(), width: img.naturalWidth, height: img.naturalHeight }]);
          });
          img.addEventListener('error', reject);
        });
      }

      throw new Error(data.type);
    });
