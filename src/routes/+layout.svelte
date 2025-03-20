<script>
  import "../app.css";
  import Header from "$lib/components/header.svelte";
  import { VisualEditing } from '@sanity/visual-editing/svelte'
  import { LiveMode } from '@sanity/svelte-loader'
  import { client } from '$lib/sanity/client'
  import { onMount } from 'svelte';
  
  // Get the preview status from the data
  export let data;
  const { preview } = data;
</script>

<div class="min-h-screen bg-background font-sans antialiased">
  {#if preview}
    <div class="bg-yellow-500 text-black py-2 px-4 text-center sticky top-0 z-50 flex justify-between items-center">
      <div>
        <span class="font-bold">Preview Mode</span>
        <span class="ml-2">You are viewing unpublished content</span>
      </div>
      <a 
        href="/api/exit-draft?redirect={window.location.pathname}" 
        class="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 text-sm"
      >
        Exit Preview
      </a>
    </div>
    
    <!-- Add Visual Editing components when in preview mode -->
    <VisualEditing />
    <LiveMode {client} />
  {/if}
  
  <Header />
  <main class="container mx-auto py-6 px-4">
    <slot />
  </main>
</div>
