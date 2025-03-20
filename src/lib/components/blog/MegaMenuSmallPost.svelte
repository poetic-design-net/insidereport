
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
  class="cursor-pointer group flex gap-3 items-center"
>
  <div class="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
    {#if post.mainImage}
      <img
        src={urlFor(post.mainImage).width(100).height(100).url()}
        alt={(post.mainImage as any).alt || post.title}
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    {:else}
      <div class="h-full w-full bg-gray-200"></div>
    {/if}
  </div>
  <h4 class="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors duration-200">
    {post.title}
  </h4>
</div>
