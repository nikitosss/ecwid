import { Query } from 'src/types/Query';

/**
 * Сериализация объекта для get-запроса
 * @param data объект параметров
 */
export const parameters = (data: Query): string =>
  Object.keys(data)
    .map((key) => `${key}=${data[key]}`)
    .join('&');

/**
 * Прокси-сервер изображений weserv.nl
 * @param source url изображения
 * @param props объект параметров
 */
export const imageProxy = (source: string, props?: Query): string =>
  `//images.weserv.nl/?${parameters({
    ...((url): Query => ({
      url,
      default: url,
    }))(encodeURIComponent(source)),
    ...props,
  })}`;
