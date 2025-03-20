<script lang="ts">
  export let message: string = "Ein Fehler ist aufgetreten";
  export let retryFn: (() => void) | null = null;
</script>

<div class="my-16 rounded-lg border border-[hsl(var(--destructive)/0.2)] bg-[hsl(var(--destructive)/0.05)] p-8 text-center">
  <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto mb-4 h-12 w-12 text-[hsl(var(--destructive))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
  <h2 class="mb-2 text-xl font-bold text-[hsl(var(--destructive))]">{message}</h2>
  <p class="mb-4 text-[hsl(var(--muted-foreground))]">
    Bitte versuche es später erneut oder kontaktiere den Support, wenn das Problem weiterhin besteht.
    {#if message.includes('Sanity')}
      <br><br>
      <span class="text-sm">
        Hinweis: Dieses Problem könnte mit der Sanity API-Verbindung zusammenhängen. 
        Stelle sicher, dass dein Sanity-Projekt korrekt konfiguriert ist und die API erreichbar ist.
      </span>
    {/if}
  </p>
  
  {#if retryFn}
    <button 
      class="inline-flex items-center justify-center rounded-md bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] shadow transition-colors hover:bg-[hsl(var(--primary)/0.9)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--ring))]"
      on:click={retryFn}
    >
      Erneut versuchen
    </button>
  {/if}
</div>
