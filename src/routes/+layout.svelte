<script>
  import "../app.css";
  import Header from "$lib/layout/Header.svelte";
  import Footer from "$lib/layout/Footer.svelte";
  import Notification from "$lib/layout/Notification.svelte";
</script>

<svelte:head>
  <link rel="icon" href="/favicon.png" />
</svelte:head>

<main class="bg-white dark:bg-black text-dark dark:text-light no-scrollbar">
  <Header />
  <slot />
  <Footer />
  <Notification />
</main>
