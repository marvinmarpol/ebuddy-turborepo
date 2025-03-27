import { User } from "@repo/entities";

import { db } from "../config/firebaseConfig";

const USERS_COLLECTION = "USERS";

export const getUsersPaginated = async (
  limit: number,
  offset: number
): Promise<User[]> => {
  const query = db
    .collection(USERS_COLLECTION)
    .orderBy("totalPotential", "desc")
    .limit(limit)
    .offset(offset);

  const snapshot = await query.get();

  const users: User[] = snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as User
  );

  return users;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const doc = await db.collection(USERS_COLLECTION).doc(id).get();
  return doc.exists ? ({ id: doc.id, ...doc.data() } as User) : null;
};

export const createUser = async (data: Partial<User>): Promise<string> => {
  const add = await db.collection(USERS_COLLECTION).add(data);
  return add.id;
};

export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<void> => {
  await db.collection(USERS_COLLECTION).doc(id).set(data, { merge: true });
};
