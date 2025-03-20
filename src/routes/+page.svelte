<script lang="ts">
  import { invalidate } from '$app/navigation';
  import type { PageData } from './$types';
  import type { Post } from './+page';
  
  // Import modular components
  import BigPost from '$lib/components/blog/BigPost.svelte';
  import HeroPost from '$lib/components/blog/HeroPost.svelte';
  import PostGrid from '$lib/components/blog/PostGrid.svelte';
  import ErrorState from '$lib/components/blog/ErrorState.svelte';
  
  export let data: PageData;
  
  // Function to retry loading data
  function retryLoading() {
    invalidate('app:blogData');
  }
  
  // Derived values
  $: status = data.status || 'success';
  $: errorMessage = data.error || 'Ein Fehler ist aufgetreten';
  $: hasPosts = data.posts && data.posts.length > 0;
  $: hasHeroPosts = data.heroPosts && data.heroPosts.length > 0;
  $: heroPost = hasPosts ? data.posts[0] : {
    title: '',
    _id: '',
    slug: { current: '' }
  };
  $: recentPosts = hasPosts ? data.posts.slice(1) : [];
</script>

{#if status === 'error'}
  <ErrorState message={errorMessage} retryFn={retryLoading} />
{:else if hasPosts}
  <div class="space-y-16">
    <!-- Übergebe sowohl den Standard-heroPost als auch die heroPosts mit dem "hero"-Tag -->
    <HeroPost post={heroPost} heroPosts={data.heroPosts || []} />
    
    {#if data.featuredPost}
      <BigPost post={data.featuredPost} />
    {/if}
    {#if recentPosts.length > 0}
    <PostGrid posts={recentPosts} />
  {/if}

  </div>
{:else}
  <div class="my-16 text-center">
    <h2 class="text-2xl font-bold">Noch keine Beiträge vorhanden</h2>
    <p class="mt-4 text-muted-foreground">Füge Beiträge in deinem Sanity Studio hinzu, um sie hier anzuzeigen.</p>
  </div>
{/if}