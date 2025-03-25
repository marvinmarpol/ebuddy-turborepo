import { User } from "@repo/entities";
import { httpRequest } from "@repo/helpers";

export interface UpdateUserPayload {
  id: string;
  token: string;
  user: User;
}

export const updateUserData = async ({
  id,
  token,
  user,
}: UpdateUserPayload) => {
  const baseURL =
    process.env.NEXT_PUBLIC_UPDATE_API_URL || "http://localhost:5000";
  const path =
    process.env.NEXT_PUBLIC_UPDATE_USER_PATH || "/api/update-user-data";
  const headers: Record<string, string> = { authorization: token };

  await new Promise((resolve) => setTimeout(resolve, 1500));

  return await httpRequest<User>(
    "POST",
    `${baseURL + path}/${id}`,
    user,
    headers
  );
};
