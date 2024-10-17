interface SignInResponse {
  UserName: string;
  authToken: string;
  email: string;
}

interface AuthState {
  email: string | null;
}

interface NavState {
  open: boolean;
}

interface AllComicsResType {
  id: string;
  ComicTitle: string;
  Description: string;
  CoverImage: string;
  Origin: string;
  Status: string;
  Genres: string;
  Author: string;
  Artist: string;
  Badges: string;
  Date: string;
}

interface ChapterResponse {
  chapters: {
    chapterID: number;
    ChapterNumber: string;
    ChapterName: string;
    chapterDate: string;
  }[];
  comicDetails: {
    ComicTitle: string;
    CoverImage: string;
    id: string;
    Artist: string;
    Author: string;
    Description: string;
    Genres: string;
    Status: string;
    Origin: string;
  };
}
