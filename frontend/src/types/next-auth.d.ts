import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string; 
      name?: string;
      email?: string;
      role?: string; 
      avatar?: string;
      referralCode?: string;
      referredById?: string;
    };
    store:{
      storeId?: string; 
      name?: string; 
      address?: string; 
    }
    accessToken?: string;
  }

  interface JWT {
    id?: string; 
    name?: string;
    email?: string;
    role?: string; 
    avatar?: string; 
    referralCode?: string;
    referredById?: string;
    accessToken?: string;

  }

  interface User {
    id?: string; // ID pengguna
    name?: string;
    email?: string;
    role?: string; 
    avatar?: string; 
    referralCode?: string;
    referredById?: string;
    accessToken?: string;
  }
}
