export default async (pageParam: number) => {
  const response = await fetch(
    `https://api.github.com/search/repositories?q=topic:reactjs&per_page=30&page=${pageParam}`
  );

  return response.json();
};
