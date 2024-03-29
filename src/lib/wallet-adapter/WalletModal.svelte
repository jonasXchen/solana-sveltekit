<script lang="ts">
  import type { WalletName } from "@solana/wallet-adapter-base";
  import { walletStore } from "@svelte-on-solana/wallet-adapter-core";
  import { createEventDispatcher } from "svelte";
  import WalletButton from "./WalletButton.svelte";

  export let maxNumberOfWallets = 3;

  let showMoreOptions = false,
    backdrop: HTMLDivElement,
    container: HTMLDivElement;

  $: numberOfWalletsShown = showMoreOptions
    ? $walletStore.wallets.length
    : maxNumberOfWallets;

  const dispatch = createEventDispatcher();

  const connect = (name: WalletName<string>) => {
    dispatch("connect", name);
  };

  const toggleMoreOptions = () => {
    showMoreOptions = !showMoreOptions;
  };

  const closeModal = (
    e: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement }
  ) => {
    if (e.target === backdrop || e.target === container) {
      dispatch("close");
    }
  };

  const handleKeyup = (e: { key: string }) => {
    if (e.key == "Escape") {
      dispatch("close");
    }
  };
</script>

<svelte:window on:keyup={handleKeyup} />

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
  aria-labelledby="wallet-adapter-modal-title"
  aria-modal="true"
  class="wallet-adapter-modal wallet-adapter-modal-fade-in"
  role="dialog"
  bind:this={backdrop}
  on:keyup={(e) => closeModal(e)}
>
  <div class="wallet-adapter-modal-container" bind:this={container}>
    <div class="wallet-adapter-modal-wrapper">
      <h1 class="wallet-adapter-modal-title">Connect Wallet</h1>

      <button
        on:click={() => dispatch("close")}
        class="wallet-adapter-modal-button-close"
      >
        <svg width="14" height="14">
          <path
            d="M14 12.461 8.3 6.772l5.234-5.233L12.006 0 6.772 5.234 1.54 0 0 1.539l5.234 5.233L0 12.006l1.539 1.528L6.772 8.3l5.69 5.7L14 12.461z"
          />
        </svg>
      </button>

      <ul class="wallet-adapter-modal-list">
        {#each $walletStore.wallets.slice(0, numberOfWalletsShown) as { adapter }}
          <li>
            <WalletButton on:click={() => connect(adapter.name)}>
              {adapter.name}

              <svelte:fragment slot="end-icon">
                <img src={adapter.icon} alt={`${name} icon`} />
              </svelte:fragment>
            </WalletButton>
          </li>
        {/each}
      </ul>

      {#if $walletStore.wallets.length > maxNumberOfWallets}
        <button
          class="wallet-adapter-modal-collapse-button wallet-adapter-button"
          style="justify-content: space-between"
          class:wallet-adapter-modal-collapse-button-active={showMoreOptions}
          on:click={() => toggleMoreOptions()}
        >
          {showMoreOptions ? "Less" : "More"} options

          <svg width="11" height="6" xmlns="http://www.w3.org/2000/svg">
            <path
              d="m5.938 5.73 4.28-4.126a.915.915 0 0 0 0-1.322 1 1 0 0 0-1.371 0L5.253 3.736 1.659.272a1 1 0 0 0-1.371 0A.93.93 0 0 0 0 .932c0 .246.1.48.288.662l4.28 4.125a.99.99 0 0 0 1.37.01z"
            />
          </svg>
        </button>
      {/if}
    </div>
  </div>
</div>
