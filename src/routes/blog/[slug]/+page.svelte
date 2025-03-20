<script lang="ts">
  import { invalidate } from '$app/navigation';
  import type { PageData } from './$types';
  import type { BlogPageData, BlogPost } from './+page';
  import { urlFor } from '$lib/sanity/urlFor';
  
  // Import components
  import CategoryBadge from '$lib/components/blog/CategoryBadge.svelte';
  import DateDisplay from '$lib/components/blog/DateDisplay.svelte';
  import ErrorState from '$lib/components/blog/ErrorState.svelte';
  import PostGrid from '$lib/components/blog/PostGrid.svelte';
  import { Avatar, AvatarImage, AvatarFallback } from "$lib/components/ui/avatar";
  import BlockContent from '$lib/components/blog/BlockContent.svelte';
  
  export let data: PageData;
  
  // Function to retry loading data
  function retryLoading() {
    invalidate('app:blogPost');
  }
  
  // Derived values
  $: status = data.status || 'success';
  $: errorMessage = data.error || 'Ein Fehler ist aufgetreten';
  $: preview = data.preview || false;
  $: post = data.post as BlogPost | null;
  $: hasRelatedPosts = post?.relatedPosts && post.relatedPosts.length > 0;
</script>

{#if status === 'error'}
  <ErrorState message={errorMessage} retryFn={retryLoading} />
{:else if post}
  <article class="mx-auto max-w-4xl">
    <!-- Hero Section -->
    <div class="relative mb-12 h-[50vh] min-h-[400px] w-full overflow-hidden rounded-lg" data-sanity-field="mainImage">
      {#if post.mainImage}
        <img
          src={urlFor(post.mainImage).width(1200).height(800).url()}
          alt={(post.mainImage as any).alt || post.title}
          class="absolute inset-0 h-full w-full object-cover"
        />
      {:else}
        <div class="absolute inset-0 bg-gray-200"></div>
      {/if}
      <div class="absolute inset-0 bg-black/50" />
    </div>
    
    <!-- Post Header -->
    <header class="mb-12">
      <div class="mb-4" data-sanity-field="categories">
        {#if post.categories && post.categories.length > 0}
          {#each post.categories as category}
            <CategoryBadge title={category.title} />
          {/each}
        {/if}
      </div>
      <h1 class="mb-6 text-4xl font-bold" data-sanity-field="title">{post.title}</h1>
      
      <!-- Author and Date -->
      <div class="flex items-center gap-4">
        <Avatar data-sanity-field="author">
          {#if post.author && post.author.image}
            <AvatarImage src={urlFor(post.author.image).width(100).height(100).url()} />
          {/if}
          <AvatarFallback>{post.author ? post.author.name.substring(0, 2).toUpperCase() : 'UN'}</AvatarFallback>
        </Avatar>
        <div>
          <p class="font-medium" data-sanity-field="author">{post.author ? post.author.name : 'Unbekannter Autor'}</p>
          <div data-sanity-field="publishedAt">
            <DateDisplay date={post.publishedAt} />
          </div>
        </div>
      </div>
    </header>
    
    <!-- Post Content -->
    <div class="prose prose-lg max-w-none">
      {#if post.excerpt}
        <p 
          class="lead text-xl font-medium text-muted-foreground"
          data-sanity-field="excerpt"
        >
          {post.excerpt}
        </p>
      {/if}
      
      <!-- Render post body with BlockContent component -->
      <div data-sanity-field="body">
        <BlockContent blocks={post.body} />
      </div>
    </div>
    
    <!-- Related Posts -->
    {#if hasRelatedPosts}
      <div class="mt-16 border-t pt-12">
        <PostGrid posts={post.relatedPosts || []} columns={3} />
      </div>
    {/if}
  </article>
{:else}
  <div class="my-16 text-center">
    <h2 class="text-2xl font-bold">Beitrag nicht gefunden</h2>
    <p class="mt-4 text-muted-foreground">Der gesuchte Beitrag existiert nicht oder wurde gelöscht.</p>
  </div>
{/if}
