export interface Photo {
  id: string;
  author: string;
  download_url: string;
  width: number;
  height: number;
  url: string;
  title?: string;
  upload_date?: string;
}

export interface PhotoContextType {
  photos: Photo[];
  loading: boolean;
  error: string | null;
  loadMore: () => void;
  hasMore: boolean;
}