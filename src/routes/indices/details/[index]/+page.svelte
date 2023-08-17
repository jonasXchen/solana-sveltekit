<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, SubmitFunction } from "./$types";
  import Confirmation from "$lib/components/Confirmation.svelte";

  export let data: PageData;

  let defaultBody = JSON.stringify(
    {
      properties: {},
    },
    null,
    2
  );

  let loading = false;
  const putMappings: SubmitFunction = () => {
    loading = true;
    return async ({ update }) => {
      loading = false;
      await update();
    };
  };

  // Delete Index Modal
  let show: boolean;
  let title = "Warning!";
  let description: string;
  let inputKey: string = "index";
  let inputValue: string;
  let action: string = "deleteIndex";
</script>

<Confirmation
  bind:show
  bind:title
  bind:description
  bind:action
  bind:inputValue
  bind:inputKey
/>

<div class="px-8 bg-white sm:px-6 lg:px-8">
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <h1 class="pt-4 mt-4 text-base font-semibold leading-6 text-gray-900">
        <a href="../">indices</a>/{data.index}
      </h1>
    </div>
    <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
      <form
        class="space-y-6"
        method="POST"
        action="?/putMappings"
        use:enhance={putMappings}
        enctype="multipart/form-data"
      >
        <div>
          <div class="mt-2">
            <input type="text" name="index" value={data.index} hidden />
            <label
              for="body"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Body
              <textarea
                name="body"
                autocomplete="on"
                rows="10"
                required
                class="block w-1/2 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >{defaultBody}
              </textarea>
            </label>
            <div class="flex gap-2">
              {#if !loading}
                <button
                  type="submit"
                  aria-busy={loading}
                  class="block px-3 py-2 mt-2 text-sm font-semibold text-center text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >Update Mapping
                </button>
              {/if}
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
  <div class="flow-root mt-8">
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <table class="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              >
                index
              </th>
              {#each Object.keys(data.indexDetails) as field}
                <th
                  scope="col"
                  class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  {field}
                </th>
              {/each}
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                <span class="sr-only">Documents</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr>
              <td class="px-3 py-4 text-sm text-gray-500 break-words align-top">
                <a href="../documents/{data.index}">{data.index}</a>
              </td>
              {#each Object.values(data.indexDetails) as value}
                <td
                  class="px-3 py-4 text-sm text-gray-500 align-top whitespace-nowrap"
                >
                  {#if typeof value === "object"}
                    <pre
                      on:click={() =>
                        navigator.clipboard.writeText(
                          JSON.stringify(value, null, 2)
                        )}>{JSON.stringify(value, null, 2)}</pre>
                  {:else}
                    {value}
                  {/if}
                </td>
              {/each}
              <td
                class="relative py-4 pl-3 pr-4 text-sm font-medium text-right align-top whitespace-nowrap sm:pr-0"
              >
                <div>
                  <a
                    href="../documents/{data.index}"
                    class="text-indigo-600 hover:text-indigo-900">Documents</a
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
