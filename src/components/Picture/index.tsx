import React from 'react';
import { Query } from 'src/types/Query';
import { imageProxy } from 'src/utils/imageProxy';

export interface PictureProps extends React.HTMLAttributes<HTMLElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  params?: Query;
}

const Picture: React.FC<PictureProps> = ({ src, alt, width, height, className, params, ...props }) => {
  const imgSource = imageProxy(src, params);
  const webpSource = imageProxy(src, {
    ...params,
    output: 'webp',
  });

  return (
    <picture className={className} {...props}>
      <source srcSet={webpSource} type="image/webp" />
      <img src={imgSource} alt={alt} width={width} height={height} />
    </picture>
  );
};

export default Picture;
