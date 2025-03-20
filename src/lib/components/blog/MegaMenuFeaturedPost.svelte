<script lang="ts">
  import { urlFor } from "$lib/sanity/urlFor";
  import { goto } from "$app/navigation";
  import type { Image } from '@sanity/types';
  
  export let post: {
    title: string;
    mainImage?: Image;
    slug?: { current: string };
  };
</script>

<div 
  on:click={() => post.slug && goto(`/blog/${post.slug.current}`)} 
  class="cursor-pointer group"
>
  <div class="relative h-48 w-full overflow-hidden rounded-lg">
    {#if post.mainImage}
      <img
        src={urlFor(post.mainImage).width(600).height(400).url()}
        alt={(post.mainImage as any).alt || post.title}
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    {:else}
      <div class="h-full w-full bg-gray-200"></div>
    {/if}
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
    <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
      <h3 class="text-lg font-bold line-clamp-2">{post.title}</h3>
    </div>
  </div>
</div>
