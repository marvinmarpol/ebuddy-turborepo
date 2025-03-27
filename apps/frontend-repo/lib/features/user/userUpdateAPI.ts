import { User } from "@repo/entities";
import { httpRequest } from "@repo/helpers";

export interface UpdateUserPayload {
  token: string;
  user: User;
}

export const updateUserData = async ({
  token,
  user,
}: UpdateUserPayload) => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const path =
    process.env.NEXT_PUBLIC_UPDATE_USER_PATH || "/api/update-user-data";
  const headers: Record<string, string> = { authorization: `Bearer ${token}` };

  const response = await httpRequest<User>(
    "POST",
    `${baseURL + path}`,
    user,
    headers
  );

  return response.data;
};
