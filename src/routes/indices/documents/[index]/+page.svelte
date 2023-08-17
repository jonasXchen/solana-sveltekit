<script lang="ts">
  import { enhance } from "$app/forms";
  import type { PageData, SubmitFunction } from "./$types";
  import Confirmation from "$lib/components/Confirmation.svelte";

  export let data: PageData;

  let loading = false;
  export const updateSubmission: SubmitFunction = (input) => {
    loading = true;
    return async ({ update }) => {
      loading = false;
      await update();
    };
  };

  // Delete Document Modal
  let show: boolean;
  let title = "Warning!";
  let description: string;
  let inputKey: string = "id";
  let inputValue: string;
  let action: string = "deleteDocument";
  let openConfirmation = (input: any) => {
    show = true;
    inputValue = input;
    description = `Are you sure to continue to delete the document id '${inputValue}'?`;
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
        <a href="./">indices</a>/{data.path}
      </h1>
    </div>
    <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
      <form
        class="space-y-6"
        method="POST"
        action="?/indexDocument"
        use:enhance={updateSubmission}
        enctype="multipart/form-data"
      >
        <div>
          <div class="mt-2">
            <label
              for="id"
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              id
              <input
                type="text"
                name="id"
                autocomplete="on"
                required
                class="block w-1/2 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </label>
            <label
              for="body"
              class="block text-sm font-medium leading-6 text-gray-900"
            >
              body
              <input
                type="text"
                name="body"
                autocomplete="on"
                required
                class="block w-1/2 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </label>
            {#if !loading}
              <button
                type="submit"
                aria-busy={loading}
                class="block px-3 py-2 mt-2 text-sm font-semibold text-center text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >Index document
              </button>
            {/if}
          </div>
        </div>
      </form>
    </div>
    <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
      <form
        class="space-y-6"
        method="POST"
        action="?/indexCsv"
        use:enhance={updateSubmission}
        enctype="multipart/form-data"
      >
        <div>
          <div class="mt-2">
            <label
              for="file"
              class="block text-sm font-medium leading-6 text-gray-900"
              >Upload CSV file
              <input
                type="file"
                name="file"
                accept=".csv"
                required
                class="block w-1/2 rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </label>
            {#if !loading}
              <button
                type="submit"
                aria-busy={loading}
                class="block px-3 py-2 mt-2 text-sm font-semibold text-center text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >Index CSV
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
        {#if data.documents[0]}
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  #
                </th>
                {#each Object.keys(data.documents[0]) as field}
                  <th
                    scope="col"
                    class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    {field}
                  </th>
                {/each}
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              {#each data.documents as document, i}
                <tr>
                  <td
                    class="px-3 py-4 text-sm text-gray-500 break-words align-top"
                  >
                    {i + 1}
                  </td>
                  {#each Object.keys(document) as key}
                    <td
                      class="px-3 py-4 text-sm text-gray-500 break-words align-top"
                    >
                      {#if typeof document[key] === "object"}
                        <pre>{JSON.stringify(document[key], null, 2)}</pre>
                      {:else if key === "_index"}
                        <a href="../details/{document[key]}">{document[key]}</a>
                      {:else}
                        {document[key]}
                      {/if}
                    </td>
                  {/each}
                  <td
                    class="relative py-4 pl-3 pr-4 text-sm font-medium text-right align-top whitespace-nowrap sm:pr-0"
                  >
                    <div>
                      <a
                        href="#"
                        on:click={() => openConfirmation(document._id)}
                        class="text-indigo-600 hover:text-indigo-900">Delete</a
                      >
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        {/if}
      </div>
    </div>
  </div>
</div>
