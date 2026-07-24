export interface User {
  id: number;
  createdAt: string | Date;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumbers: string[];
  city: string;
}
