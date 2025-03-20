<script lang="ts">
  import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { goto } from "$app/navigation";
  import { urlFor } from "$lib/sanity/urlFor";
  import AuthorInfo from "./AuthorInfo.svelte";
  import type { Image } from '@sanity/types';
  
  export let post: {
    title: string;
    excerpt?: string;
    mainImage?: Image;
    author?: { name: string; image?: Image };
    slug?: { current: string };
  };
</script>

<div on:click={() => post.slug && goto(`/blog/${post.slug.current}`)} class="cursor-pointer">
<Card class="transition-all duration-200 hover:shadow-md">
  <CardHeader>
    {#if post.mainImage}
      <img
        src={urlFor(post.mainImage).width(800).height(400).url()}
        alt={(post.mainImage as any).alt || post.title}
        class="mb-4 h-48 w-full rounded-lg object-cover"
      />
    {:else}
      <div class="mb-4 h-48 w-full rounded-lg bg-gray-200"></div>
    {/if}
    <CardTitle class="line-clamp-2">
      {post.title}
    </CardTitle>
    <CardDescription>
      {post.excerpt || 'Keine Beschreibung verfügbar'}
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div class="flex items-center justify-between">
      <AuthorInfo author={post.author} size="sm" />
      <Button 
        variant="ghost" 
        size="sm" 
        class="hover:text-primary"
      >
        Lesen →
      </Button>
    </div>
  </CardContent>
</Card>
</div>
