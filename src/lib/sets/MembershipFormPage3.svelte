<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  const handlePrevious = () => {
    // Dispatch an event to indicate the previous page should be shown
    dispatch('previous');
  }
</script>

<h1>Page 3</h1>

<form>
  <!-- Form fields for page 3 -->
  
  <button type="button" on:click={handlePrevious}>Previous</button>
  <button type="submit">Submit</button>
</form>
