<script>
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    
    const handleSubmit = () => {
      // Handle form submission
      // Dispatch an event to indicate the next page should be shown
      dispatch('next');
    }
</script>
  
<h1>Page 1</h1>

<form on:submit|preventDefault={handleSubmit}>
<!-- Form fields for page 1 -->

<button type="submit">Next</button>
</form>