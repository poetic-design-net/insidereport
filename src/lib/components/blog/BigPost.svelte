<script lang="ts">
  import { Avatar, AvatarImage, AvatarFallback } from "$lib/components/ui/avatar";
  import { urlFor } from "$lib/sanity/urlFor";
  import { goto } from "$app/navigation";
  import CategoryBadge from "./CategoryBadge.svelte";
  import DateDisplay from "./DateDisplay.svelte";
  import { Button } from "$lib/components/ui/button";
  import type { Image } from '@sanity/types';
  
  export let post: {
    title: string;
    mainImage?: Image;
    publishedAt?: string;
    author?: { name: string; image?: Image };
    categories?: Array<{ _id: string; title: string }>;
    tags?: Array<{ _id: string; title: string }>;
    slug?: { current: string };
    excerpt?: string;
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<section role="button" tabindex="0" class="mb-16 cursor-pointer transition-all duration-300 hover:opacity-95" on:click={() => post.slug && goto(`/blog/${post.slug.current}`)}>
  <div class="bg-white rounded-4xl px-6 mb-6 md:px-12 py-12">
    <div class="flex items-center gap-4 mb-2">
      {#if post.categories && post.categories.length > 0}
        <CategoryBadge title={post.categories[0].title} />
      {/if}

    </div>
    <div class="flex flex-wrap -m-4 md:divide-x md:divide-neutral-100">
      <div class="w-full md:w-1/2 lg:w-2/3 p-4">
        <div class="max-w-xl">
          <h2 class="mb-16 text-neutral-800 text-6xl sm:text-7xl xl:text-10xl font-semibold font-heading">
            <span class="relative inline-block">
              <span class="relative z-10">{post.title}</span>
            </span>
          </h2>
          {#if post.excerpt}
            <p class="text-neutral-600 text-2xl font-medium mb-16 md:mb-32 tracking-tight">{post.excerpt}</p>
          {/if}
          <div class="flex flex-wrap items-center gap-6 lg:gap-12 mb-6 lg:mb-0">
            <Button href={post.slug ? `/blog/${post.slug.current}` : "/"} size="default" variant="neutral" >
              Read more
            </Button>
            {#if post.publishedAt}
              <DateDisplay date={post.publishedAt} />
            {/if}
          </div>
        </div>
      </div>
      <div class="w-full md:w-1/2 lg:w-1/3 p-4">
        <div class="md:relative md:top-6 md:max-w-sm md:max-h-128 md:mx-auto md:px-3 md:mr-0 w-full h-full">
          {#if post.mainImage}
            <img class="rounded-4xl mx-auto object-cover" style="height: 467px;" src={urlFor(post.mainImage).width(800).height(467).url()} alt={(post.mainImage as any).alt || post.title}/>
          {/if}
        </div>
      </div>
    </div>
  </div>
</section>
