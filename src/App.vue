<template>
  <Transition mode="out-in">
    <span v-if="isLoading">Loading...</span>
    <div v-else-if="isError">An error has occurred: {{ error }}</div>
    <main v-else-if="data" class="main">
      <h1>Infinite scroll</h1>

      <ul v-for="(page, index) in data.pages" :key="index">
        <li
          v-for="repo in page.items"
          v-bind:key="repo.id"
          class="repo"
        >
          <p>
            <b>
              {{ repo.name }}
            </b>
          </p>
          <p>{{ repo.description }}</p>
        </li>
      </ul>

      <div v-if="isFetchingNextPage">Loading more...</div>
      <div v-else-if="hasNextPage">Load More</div>
      <div v-else>Nothing more to load</div>
    </main>
  </Transition>
</template>

<script setup lang="ts">
import { useInfiniteQuery } from 'vue-query';
import { ref, onMounted, onUnmounted } from 'vue';

import fetchRespositories from './services/fetchRespositories';

const {
  data,
  error,
  isError,
  isLoading,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
} = useInfiniteQuery(
  'repositories',
  ({ pageParam = 1 }) => fetchRespositories(pageParam),
  {
    getNextPageParam: (lastPage, allPages) => {
      const maxPages = lastPage.total_count / 30;
      const nextPage = allPages.length + 1;

      return nextPage <= maxPages ? nextPage : undefined;
    },
  }
);

const fetching = ref(false);

const handleScroll = async (event: any) => {
  const { scrollHeight, scrollTop, clientHeight } =
    event.target.scrollingElement;

  if (
    !fetching.value &&
    scrollHeight - scrollTop <= clientHeight * 1.5
  ) {
    fetching.value = true;

    if (hasNextPage) {
      console.log('Fetching');

      await fetchNextPage.value();
    }

    fetching.value = false;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.repo {
  text-align: left;
  border: 1px solid;
  padding: 8px;
  margin-bottom: 8px;
  display: block;
}
</style>
