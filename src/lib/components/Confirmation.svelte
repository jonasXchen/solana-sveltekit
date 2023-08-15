<script lang="ts">
  import { enhance } from "$app/forms";

  const onEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape" || event.keyCode === 27) {
      show = false;
    }
  };

  export let show: boolean = false;
  export let title: string = "Warning!";
  export let description: string = "Are you sure to confirm your action?";
  export let confirm: string = "Confirm";
  export let cancel: string = "Cancel";
  export let action: string;
  export let inputValue: string;
  export let inputKey: string;
</script>

<svelte:window on:keydown={onEscape} />
{#if show}
  <div
    class="relative z-10 h-screen"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <!--
      Background backdrop, show/hide based on modal state.
  
      Entering: "ease-out duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100"
        To: "opacity-0"
    -->
    <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="flex items-center justify-center min-h-full p-4 text-center sm:items-end sm:p-0"
        on:click={() => (show = false)}
      >
        <!--
          Modal panel, show/hide based on modal state.
  
          Entering: "ease-out duration-300"
            From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            To: "opacity-100 translate-y-0 sm:scale-100"
          Leaving: "ease-in duration-200"
            From: "opacity-100 translate-y-0 sm:scale-100"
            To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        -->
        <div
          class="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
          on:click|stopPropagation
        >
          <div class="absolute top-0 right-0 pt-4 pr-4 sm:block">
            <button
              type="button"
              on:click={() => (show = false)}
              class="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none"
            >
              <span class="sr-only">Close</span>
              <svg
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div class="sm:flex sm:items-start">
            <div
              class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10"
            >
              <svg
                class="w-6 h-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <h3
                class="text-base font-semibold leading-6 text-gray-900"
                id="modal-title"
              >
                {title}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  {description}
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:ml-10 sm:mt-4 sm:flex sm:pl-4">
            <form
              method="POST"
              action="?/{action}"
              enctype="multipart/form-data"
            >
              <input hidden name={inputKey} type="input" value={inputValue} />
              <button
                type="submit"
                class="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-500 sm:w-auto"
                >{confirm}</button
              >
            </form>

            <button
              type="button"
              on:click={() => (show = false)}
              class="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:ml-3 sm:mt-0 sm:w-auto"
              >{cancel}</button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
