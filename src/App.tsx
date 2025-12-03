import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import {
  HomePage,
  SearchPage,
  PhotoDetailPage,
  UserProfilePage,
  CollectionsPage,
  CollectionDetailPage,
  UploadPage,
} from './pages';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="photos/:photoId" element={<PhotoDetailPage />} />
        <Route path="users/:username" element={<UserProfilePage />} />
        <Route path="collections" element={<CollectionsPage />} />
        <Route path="collections/:collectionId" element={<CollectionDetailPage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;
