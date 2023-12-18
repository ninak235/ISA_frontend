export interface User {
  id: number;
  username: string;
  role: Role;
}

export interface Role {
  roles: string[];
}
