import { User } from "@repo/entities";

import { db } from "../config/firebaseConfig";

const USERS_COLLECTION = "USERS";

export const getUserById = async (id: string): Promise<User | null> => {
  const doc = await db.collection(USERS_COLLECTION).doc(id).get();
  return doc.exists ? ({ id: doc.id, ...doc.data() } as User) : null;
};

export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<void> => {
  await db.collection(USERS_COLLECTION).doc(id).set(data, { merge: true });
};
