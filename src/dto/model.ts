
export interface CreateUserDto {
    id?: number;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }
  
  export interface AuthorDto {
    firstname: string;
    lastname: string;
    email: string;
  }
  
  export interface PostDto {
    id?: number;
    title: string;
    body: string;
    published?: boolean;
    author?: AuthorDto;
    authorId?: number;
  }