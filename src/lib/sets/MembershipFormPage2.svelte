<script>
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  const handleSubmit = () => {
    // Handle form submission
    // Dispatch an event to indicate the next page should be shown
    dispatch('next');
  }
  
  const handlePrevious = () => {
    // Dispatch an event to indicate the previous page should be shown
    dispatch('previous');
  }
</script>

<h1>Page 2</h1>

<form on:submit|preventDefault={handleSubmit}>
  <!-- Form fields for page 2 -->
  
  <button type="button" on:click={handlePrevious}>Previous</button>
  <button type="submit">Next</button>
</form>