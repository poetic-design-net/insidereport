<script lang="ts">
  import { urlFor } from '$lib/sanity/urlFor';
  
  // Define types for block content
  interface BlockChild {
    _key: string;
    _type: string;
    marks: string[];
    text: string;
  }
  
  interface MarkDef {
    _key: string;
    _type: string;
    href?: string;
    blank?: boolean;
  }
  
  interface Block {
    _key: string;
    _type: string;
    style?: string;
    listItem?: string;
    level?: number;
    children?: BlockChild[];
    markDefs?: MarkDef[];
    [key: string]: any;
  }
  
  export let blocks: Block[] = [];
</script>

{#if blocks && blocks.length > 0}
  <div class="block-content">
    {#each blocks as block}
      {#if block._type === 'block'}
        {#if block.style === 'h1'}
          <h1 class="mt-8 mb-4 text-3xl font-bold">{@html block.children?.map((child: BlockChild) => child.text).join('')}</h1>
        {:else if block.style === 'h2'}
          <h2 class="mt-8 mb-4 text-2xl font-bold">{@html block.children?.map((child: BlockChild) => child.text).join('')}</h2>
        {:else if block.style === 'h3'}
          <h3 class="mt-6 mb-3 text-xl font-bold">{@html block.children?.map((child: BlockChild) => child.text).join('')}</h3>
        {:else if block.style === 'h4'}
          <h4 class="mt-6 mb-3 text-lg font-bold">{@html block.children?.map((child: BlockChild) => child.text).join('')}</h4>
        {:else if block.style === 'blockquote'}
          <blockquote class="my-6 border-l-4 border-primary pl-4 italic">
            {@html block.children?.map((child: BlockChild) => child.text).join('')}
          </blockquote>
        {:else if block.style === 'code'}
          <pre class="my-6 overflow-x-auto rounded-md bg-gray-100 p-4">
            <code>{@html block.children?.map((child: BlockChild) => child.text).join('')}</code>
          </pre>
        {:else if block.listItem === 'bullet'}
          <ul class="my-4 ml-6 list-disc">
            <li>{@html block.children?.map((child: BlockChild) => child.text).join('')}</li>
          </ul>
        {:else if block.listItem === 'number'}
          <ol class="my-4 ml-6 list-decimal">
            <li>{@html block.children?.map((child: BlockChild) => child.text).join('')}</li>
          </ol>
        {:else}
          <p class="my-4">{@html block.children?.map((child: BlockChild) => {
            if (child.marks && child.marks.length > 0) {
              let text = child.text;
              
              // Apply formatting based on marks
              if (child.marks.includes('strong')) {
                text = `<strong>${text}</strong>`;
              }
              if (child.marks.includes('em')) {
                text = `<em>${text}</em>`;
              }
              if (child.marks.includes('code')) {
                text = `<code>${text}</code>`;
              }
              if (child.marks.includes('underline')) {
                text = `<u>${text}</u>`;
              }
              if (child.marks.includes('strike-through')) {
                text = `<s>${text}</s>`;
              }
              if (child.marks.includes('highlight')) {
                text = `<mark>${text}</mark>`;
              }
              
              // Handle links
              const linkMark = child.marks.find((mark: string) => block.markDefs?.find((def: MarkDef) => def._key === mark && def._type === 'link'));
              if (linkMark) {
                const linkDef = block.markDefs?.find((def: MarkDef) => def._key === linkMark);
                if (linkDef) {
                  const target = linkDef.blank ? ' target="_blank" rel="noopener noreferrer"' : '';
                  text = `<a href="${linkDef.href}"${target}>${text}</a>`;
                }
              }
              
              return text;
            }
            return child.text;
          }).join('')}</p>
        {/if}
      {:else if block._type === 'image'}
        <figure class="my-8">
          <img 
            src={urlFor(block).width(800).url()} 
            alt={block.alt || 'Blog image'} 
            class="rounded-md"
          />
          {#if block.caption}
            <figcaption class="mt-2 text-center text-sm text-muted-foreground">{block.caption}</figcaption>
          {/if}
        </figure>
      {:else if block._type === 'code'}
        <pre class="my-6 overflow-x-auto rounded-md bg-gray-100 p-4">
          <code class="language-{block.language || 'text'}">{block.code}</code>
        </pre>
      {:else if block._type === 'embed'}
        <div class="my-8">
          {#if block.type === 'youtube' && block.url}
            <div class="aspect-w-16 aspect-h-9">
              <iframe
                src={block.url.replace('youtube.com/watch?v=', 'youtube.com/embed/')}
                title="YouTube video"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="h-full w-full rounded-md"
              ></iframe>
            </div>
          {:else if block.type === 'vimeo' && block.url}
            <div class="aspect-w-16 aspect-h-9">
              <iframe
                src={block.url.replace('vimeo.com/', 'player.vimeo.com/video/')}
                title="Vimeo video"
                frameborder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowfullscreen
                class="h-full w-full rounded-md"
              ></iframe>
            </div>
          {:else}
            <div class="rounded-md border p-4 text-center">
              <p>Embedded content: {block.url}</p>
            </div>
          {/if}
        </div>
      {:else}
        <div class="my-4 rounded-md border p-4">
          <p class="text-sm text-muted-foreground">Unbekannter Block-Typ: {block._type}</p>
        </div>
      {/if}
    {/each}
  </div>
{:else}
  <div class="my-8 rounded-md border p-4 text-center">
    <p>Kein Inhalt verfügbar</p>
  </div>
{/if}

<style>
  /* Additional styling for block content */
  :global(.block-content a) {
    color: var(--color-primary);
    text-decoration: underline;
  }
  
  :global(.block-content a:hover) {
    text-decoration: none;
  }
  
  :global(.block-content code) {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.9em;
  }
</style>
