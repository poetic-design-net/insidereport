<script lang="ts">
  import PostCard from "./PostCard.svelte";
  import type { Image } from '@sanity/types';
  
  export let posts: Array<{
    _id: string;
    title: string;
    excerpt?: string;
    mainImage?: Image;
    author?: { name: string; image?: Image };
    slug?: { current: string };
  }>;
  
  export let columns: 1 | 2 | 3 | 4 = 3;
  
  const columnClass = {
    1: '',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };
</script>

<section>
  <h2 class="mb-8 text-3xl font-bold">Aktuelle Beiträge</h2>
  <div class="grid gap-12 {columnClass[columns]}">
    {#each posts as post (post._id)}
      <PostCard {post} />
    {/each}
  </div>
</section>
