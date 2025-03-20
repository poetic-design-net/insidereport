<script lang="ts">
  import { Avatar, AvatarImage, AvatarFallback } from "$lib/components/ui/avatar";
  import { urlFor } from "$lib/sanity/urlFor";
  import type { Image } from '@sanity/types';
  
  export let author: { name: string; image?: Image } | null | undefined;
  export let size: 'sm' | 'md' | 'lg' = 'md';
  
  const avatarSizeClass = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };
  
  const textSizeClass = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
</script>

<div class="flex items-center gap-2">
  <Avatar class={avatarSizeClass[size]}>
    {#if author && author.image}
      <AvatarImage src={urlFor(author.image).width(100).height(100).url()} />
    {/if}
    <AvatarFallback>{author ? author.name.substring(0, 2).toUpperCase() : 'UN'}</AvatarFallback>
  </Avatar>
  <span class="{textSizeClass[size]} text-muted-foreground">{author ? author.name : 'Unbekannter Autor'}</span>
</div>
