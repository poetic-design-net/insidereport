<script lang="ts">
  import { onMount } from 'svelte';
  import { Avatar, AvatarImage, AvatarFallback } from "$lib/components/ui/avatar";
  import { urlFor } from "$lib/sanity/urlFor";
  import { goto } from "$app/navigation";
  import CategoryBadge from "./CategoryBadge.svelte";
  import DateDisplay from "./DateDisplay.svelte";
  import type { Post } from '../../../routes/+layout';
  import type { Image } from '@sanity/types';
  
  // Complete imports for Swiper with fade effect
  import { register } from 'swiper/element/bundle';
  import { EffectFade, Pagination, Autoplay } from 'swiper/modules';
  
  // Import Swiper styles - important for correct display
  import 'swiper/css';
  import 'swiper/css/pagination';
  import 'swiper/css/effect-fade';
  
  // Register Swiper modules
  register();
  
  export let post: Post;
  export let heroPosts: Post[] = [];

  $: displayPosts = heroPosts.length > 0 ? heroPosts : [post];

  let swiperEl: HTMLElement;

  onMount(() => {
    console.log('Initializing Swiper with fade effect...');
    
    // Important: Wait until DOM is fully loaded
    setTimeout(() => {
      // Here we pass the modules explicitly
      const params = {
        modules: [EffectFade, Pagination, Autoplay], // Explicitly pass modules
        slidesPerView: 1,
        spaceBetween: 0,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        speed: 500,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          type: 'bullets',
          verticalClass: 'swiper-pagination-vertical',
          renderBullet: function (index: number, className: string) {
            return '<span class="' + className + ' custom-bullet"></span>';
          }
        },
        init: false // Important: We initialize manually
      };

      console.log('Swiper parameters:', params);

      // @ts-ignore
      Object.assign(swiperEl, params);
      
      // @ts-ignore
      swiperEl.initialize();
      
    }, 0);
  });

  const navigateToPost = (postSlug: string) => postSlug && goto(`/blog/${postSlug}`);
</script>

<section class="mb-16">
  <div class="relative h-[60vh] min-h-[400px] w-full overflow-hidden rounded-4xl">
    <!-- Position pagination absolutely within the slider container -->
    <div class="absolute right-8 h-full top-0 flex items-center z-20">
      <div class="swiper-pagination"></div>
    </div>
    
    <!-- init="false" is important as we control initialization manually -->
    <swiper-container
      bind:this={swiperEl}
      class="h-full w-full"
      init="false"
    >
      {#each displayPosts as currentPost}
        <swiper-slide>
          <div 
            class="relative h-[60vh] min-h-[400px] w-full cursor-pointer"
            role="button"
            tabindex="0"
            on:click={() => currentPost.slug && navigateToPost(currentPost.slug.current)}
            on:keydown={(e) => e.key === 'Enter' && currentPost.slug && navigateToPost(currentPost.slug.current)}
          >
            {#if currentPost.mainImage}
              <img
                src={urlFor(currentPost.mainImage).width(1200).height(800).url()}
                alt={(currentPost.mainImage as any).alt || currentPost.title}
                class="absolute inset-0 h-full w-full object-cover"
              />
            {:else}
              <div class="absolute inset-0 bg-gray-200"></div>
            {/if}
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            
            <div class="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div class="mb-4">
                {#if currentPost.categories && currentPost.categories.length > 0}
                  {#each currentPost.categories as category}
                    <CategoryBadge title={category.title} />
                  {/each}
                {/if}
              </div>
              <h1 class="mb-4 text-4xl font-bold transition-all duration-200 hover:text-white/90">{currentPost.title}</h1>
              <div class="flex items-center gap-4">
                <Avatar>
                  {#if currentPost.author && currentPost.author.image}
                    <AvatarImage src={urlFor(currentPost.author.image).width(100).height(100).url()} />
                  {/if}
                  <AvatarFallback>{currentPost.author ? currentPost.author.name.substring(0, 2).toUpperCase() : 'UN'}</AvatarFallback>
                </Avatar>
                <div class="text-sm">
                  <p class="font-medium">{currentPost.author ? currentPost.author.name : 'Unbekannter Autor'}</p>
                  <DateDisplay date={currentPost.publishedAt} />
                </div>
              </div>
            </div>
          </div>
        </swiper-slide>
      {/each}
    </swiper-container>
  </div>
</section>

<style>
  /* Override Swiper's default pagination styles */
  :global(.swiper-pagination) {
    display: flex !important;
    flex-direction: column !important;
    gap: 1rem !important;
    width: auto !important;
    position: static !important; /* Reset position to let the parent container handle it */
    margin: 0 !important;
  }

  :global(.swiper-pagination-bullet) {
    background: white !important;
    opacity: 0.5 !important;
    width: 8px !important;
    height: 8px !important;
    margin: 0 !important;
    border-radius: 100px !important;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
    display: block !important;
  }

  :global(.swiper-pagination-bullet-active) {
    opacity: 1 !important;
    height: 32px !important; /* Increased from 24px to 32px */
    background: white !important;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2) !important;
  }

  :global(.custom-bullet) {
    background: white !important;
  }

  /* Styles for fade transition */
  :global(.swiper-fade .swiper-slide) {
    pointer-events: none;
    transition: opacity 0.5s ease;
  }

  :global(.swiper-fade .swiper-slide-active) {
    pointer-events: auto;
  }
</style>