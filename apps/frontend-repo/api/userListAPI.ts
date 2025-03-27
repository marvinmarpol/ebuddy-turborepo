import { User } from "@repo/entities";
import { httpRequest } from "@repo/helpers";

export interface UserListPayload {
  token: string;
  limit?: number;
  page?: number;
}

export const getUserList = async ({ token, limit, page }: UserListPayload) => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const path = process.env.NEXT_PUBLIC_USER_LIST_PATH || "/api/users";
  const headers: Record<string, string> = { authorization: `Bearer ${token}` };

  return await httpRequest<User[]>(
    "GET",
    `${baseURL + path}?limit=${limit}&page=${page}`,
    null,
    headers,
  );
};
