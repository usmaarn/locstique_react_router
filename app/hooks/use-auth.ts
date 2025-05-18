import { useEffect, useState } from "react";
import type { User } from "~/database/schema.server";
import { config } from "~/lib/config";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userJson = localStorage.getItem(config.storage.authName);
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  }, []);

  return { user };
}
