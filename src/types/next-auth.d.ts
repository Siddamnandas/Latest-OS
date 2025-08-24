import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultUser & {
      id: string;
      role?: string | null;
      couple?: any;
    };
  }

  interface User extends DefaultUser {
    role?: string | null;
    couple?: any;
  }
}
