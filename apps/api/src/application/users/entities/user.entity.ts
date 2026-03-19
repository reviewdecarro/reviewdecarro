import { User } from '../../../../generated/prisma/client';

export class UserEntity implements User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;

  constructor(props: User) {
    this.id = props.id;
    this.username = props.username;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.createdAt = props.createdAt;
  }
}
