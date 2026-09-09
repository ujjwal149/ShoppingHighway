import { db } from "../prisma/db";

export const getCategoryAndDescendantIds = async (
  categoryId: number,
): Promise<number[]> => {
  const categories = await db.orm.public.Category
    .select("id", "parentId")
    .all();

  const categoryExists = categories.some(
    (category) => category.id === categoryId,
  );

  if (!categoryExists) {
    return [];
  }

  const categoryIds: number[] = [categoryId];

  const queue: number[] = [categoryId];

  while (queue.length > 0) {
    const currentCategoryId = queue.shift()!;

    const children = categories.filter(
      (category) =>
        category.parentId === currentCategoryId,
    );

    for (const child of children) {
      categoryIds.push(child.id);
      queue.push(child.id);
    }
  }

  return categoryIds;
};

export const getAllCategories = async () => {
  return db.orm.public.Category
    .select("id", "name", "parentId")
    .orderBy((category) => category.name.asc())
    .all();
};