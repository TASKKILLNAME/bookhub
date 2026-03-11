export interface User {
  id: string;
  user_id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher?: string;
  isbn?: string;
  cover_url?: string;
  description?: string;
  published_date?: string;
}

export interface ReadingRecord {
  id: string;
  user_id: string;
  user_name: string;
  book: Book;
  rating: number;
  description: string;
  like_count: number;
  comment_count: number;
  is_liked?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  record_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface ReadingActivity {
  date: string;
  count: number;
}

export interface UserStats {
  total_books: number;
  average_rating: number;
  rating_count: number;
  genre_distribution: GenreCount[];
  reading_activities: ReadingActivity[];
  recent_books: ReadingRecord[];
  top_books: ReadingRecord[];
}

export interface GenreCount {
  genre: string;
  count: number;
}

export interface Story {
  id: string;
  user_id: string;
  user_name: string;
  title: string;
  content: string;
  like_count: number;
  comment_count: number;
  created_at: string;
}
