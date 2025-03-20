<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { client } from "$lib/sanity/client";
  import MegaMenuFeaturedPost from "./blog/MegaMenuFeaturedPost.svelte";
  import MegaMenuSmallPost from "./blog/MegaMenuSmallPost.svelte";
  import type { Category, Post } from "../../routes/+layout";

  let isDarkMode = false;
  let categoryPosts: Record<string, Post[]> = {};

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.documentElement.classList.toggle('dark');
  }

  // Access categories from the page data store
  $: categories = ($page.data.categories || []) as Category[];

  // Fetch posts for each category
  onMount(async () => {
    if (categories.length > 0) {
      const promises = categories.map(async (category: Category) => {
        const query = `
          *[_type == "post" && references(*[_type == "category" && _id == "${category._id}"]._id)] | order(publishedAt desc)[0...3] {
            _id,
            title,
            slug,
            mainImage,
            publishedAt
          }
        `;
        
        try {
          const result = await client.fetch(query);
          categoryPosts[category._id] = result;
        } catch (err) {
          console.error(`Error fetching posts for category ${category.title}:`, err);
          categoryPosts[category._id] = [];
        }
      });
      
      await Promise.all(promises);
      categoryPosts = {...categoryPosts}; // Trigger reactivity
    }
  });

  // Helper function to get posts for a specific category
  function getPostsForCategory(categoryId: string) {
    const catPosts = categoryPosts[categoryId] || [];
    return {
      featuredPost: catPosts.length > 0 ? catPosts[0] : null,
      smallPosts: catPosts.length > 1 ? catPosts.slice(1, 3) : []
    };
  }
</script>

<header class="border-b">
  <div class="container mx-auto px-4 py-4">
    <nav class="flex items-center justify-between">
      <!-- Logo/Titel -->
      <div class="flex items-center gap-4">
        <a href="/" class="text-2xl font-bold hover:text-primary">
          Inside Report
        </a>
      </div>

      <!-- Navigation -->
      <div class="hidden md:flex items-center gap-6">
        <a href="/" class="hover:text-primary">Home</a>
        
        <!-- Categories as main navigation items -->
        {#if categories && categories.length > 0}
          {#each categories as category}
            <div class="relative group ">
              <a 
                href={`/blog?category=${category._id}`} 
                class="hover:text-primary flex items-center gap-1"
              >
                {category.title}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
              </a>
              
              <!-- Megamenu for each category -->
              <div class="absolute bg-white left-0 mt-2 w-[600px] bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div class="p-6">
                  <h3 class="font-bold mb-4 text-primary text-lg">{category.title}</h3>
                  
                  <!-- Featured Posts -->
                  <div class="grid grid-cols-12 gap-4 ">
                    {#if categoryPosts[category._id]}
                      {@const { featuredPost, smallPosts } = getPostsForCategory(category._id)}
                      {#if featuredPost}
                        <div class="col-span-7">
                          <MegaMenuFeaturedPost post={featuredPost} />
                        </div>
                        <div class="col-span-5 flex flex-col gap-4">
                          {#each smallPosts as post}
                            <MegaMenuSmallPost post={post} />
                          {/each}
                        </div>
                      {:else}
                        <div class="col-span-12 text-muted-foreground">
                          Keine Beiträge in dieser Kategorie
                        </div>
                      {/if}
                    {:else}
                      <div class="col-span-12 flex justify-center items-center h-32">
                        <div class="animate-pulse w-8 h-8 rounded-full bg-muted"></div>
                      </div>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          {/each}
        {/if}

      </div>
 <!-- Actions -->
 <div class="flex items-center gap-4">
  <Button 
    variant="default" 
    size="sm"
    href="/about"
    class="rounded-4xl bg-white"

  >
Über uns
  </Button>
  
</div>
     
    </nav>
  </div>
</header>
