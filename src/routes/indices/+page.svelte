<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, SubmitFunction } from "./$types";
  import Confirmation from "$lib/components/Confirmation.svelte";
  import CopyIcon from "$lib/assets/images/copy.png";

  export let data: PageData;

  let loading = false;
  const createIndex: SubmitFunction = () => {
    loading = true;
    return async ({ update }) => {
      loading = false;
      await update();
    };
  };

  let defaultBody = JSON.stringify(
    {
      aliases: {},
      settings: {},
      mappings: {
        properties: {},
      },
    },
    null,
    2
  );

  let copyIndexDetails = async (index: string) => {
    let data = { index: index };
    const response = await fetch("/api/indices", {
      method: "POST",
      body: JSON.stringify(data),
    });
    const indexDetails = await response.json();
    navigator.clipboard.writeText(JSON.stringify(indexDetails, null, 2));
    console.log(indexDetails);
    return indexDetails;
  };

  // Delete Index Modal
  let show: boolean;
  let title = "Warning!";
  let description: string;
  let inputKey: string = "index";
  let inputValue: string;
  let action: string = "deleteIndex";
  let openConfirmation = (input: any) => {
    show = true;
    inputValue = input;
    description = `Are you sure to continue to delete the index '${inputValue}'?`;
  };
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
        Indices
      </h1>
    </div>
    <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
      <form
        class="space-y-6"
        method="POST"
        action="?/createIndex"
        use:enhance={createIndex}
        enctype="multipart/form-data"
      >
        <div>
          <div class="mt-2">
            <label
              for="index"
              class="block text-sm font-medium leading-6 text-gray-900"
              >index
              <input
                type="text"
                name="index"
                required
                class="block w-1/2 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </label>
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
            {#if !loading}
              <button
                type="submit"
                aria-busy={loading}
                class="block px-3 py-2 mt-2 text-sm font-semibold text-center text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >Create index
              </button>
            {/if}
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
                #
              </th>
              {#each Object.keys(data.indices[0]) as field}
                <th
                  scope="col"
                  class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  {field}
                </th>
              {/each}
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                <span class="sr-only">Details</span>
              </th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                <span class="sr-only">Delete</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            {#each data.indices as index, i}
              <tr>
                <td class="px-3 py-4 text-sm text-gray-500 break-words">
                  {i + 1}
                </td>
                {#each Object.values(index) as value, i}
                  <td class="px-3 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {#if Object.keys(data.indices[0]).indexOf("index") == i}
                      <a href="indices/documents/{value}">{value}</a>
                    {:else if typeof value === "object"}
                      <pre>{JSON.stringify(value, null, 2)}</pre>
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
                      href="./indices/details/{index.index}"
                      class="text-indigo-600 hover:text-indigo-900">Details</a
                    >
                    <button on:click={() => copyIndexDetails(index.index)}
                      ><img src={CopyIcon} alt="copy" class="h-4" />
                    </button>
                  </div>
                </td>
                <td
                  class="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-0"
                  ><div />
                  <a
                    href="#"
                    on:click={() => openConfirmation(index.index)}
                    class="text-indigo-600 hover:text-indigo-900">Delete</a
                  >
                  <div />
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
