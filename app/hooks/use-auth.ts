import { useEffect, useState } from "react";
import type { User } from "~/database/schema";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    console.log("Fetching user....");
  }, []);

  return { user, setUser };
}
