<script lang="ts">
  export let date: string | null | undefined;
  
  // Format date to German locale
  function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
</script>

<span class="text-sm opacity-75">{formatDate(date)}</span>
