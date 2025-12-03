import Masonry from 'react-masonry-css';
import { PhotoCard } from './PhotoCard';
import type { PhotoResponse } from '../../types';
import './PhotoGrid.css';

interface PhotoGridProps {
  photos: PhotoResponse[];
}

export const PhotoGrid = ({ photos }: PhotoGridProps) => {
  const breakpointColumns = {
    default: 3,
    1100: 2,
    700: 1,
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="photo-grid"
      columnClassName="photo-grid-column"
    >
      {photos.map((photo) => (
        <div key={photo.id} className="photo-card">
          <PhotoCard photo={photo} />
        </div>
      ))}
    </Masonry>
  );
};
