type GroupKey = string | number | symbol;
type GroupFunction<T> = (item: T, index?: number) => GroupKey;

// 文章、短文都会用到，所以对条目类型不做限定
export function getPostsByGroupCondition<T>(
  posts: T[],
  groupFunction: GroupFunction<T>
) {
  const result: Record<GroupKey, T[]> = {};

  for (let i = 0; i < posts.length; i++) {
    const item = posts[i];
    const groupKey = groupFunction(item, i);

    if (!result[groupKey]) {
      result[groupKey] = [];
    }

    result[groupKey].push(item);
  }

  return result;
}
