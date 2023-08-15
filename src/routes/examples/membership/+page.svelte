<script lang="ts">
  import { enhance } from "$app/forms";

  import type { PageData, ActionData, SubmitFunction } from "./$types";
  import { walletStore } from "@svelte-on-solana/wallet-adapter-core";

  export let data: PageData;
  export let form: ActionData;

  let loading = false;

  const addMember: SubmitFunction = (input) => {
    loading = true;

    return async ({ update }) => {
      loading = false;
      await update();
    };
  };

  let uploadedImage: string;

  const handleDisplayImage = (e: Event) => {
    const image = (e.target as HTMLInputElement)?.files?.[0];
    if (!image) return;
    uploadedImage = URL.createObjectURL(image);
  };

  console.log(form);
</script>

<pre>
    {JSON.stringify(data, null, 2)}
    {JSON.stringify(form, null, 2)}
    
</pre>

<ul>
  <div class="py-32 bg-white">
    <div class="px-6 mx-auto text-center max-w-7xl lg:px-8">
      <div class="max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Meet our team
        </h2>
        <p class="mt-4 text-lg leading-8 text-gray-600">
          We’re a dynamic group of individuals who are passionate about what we
          do.
        </p>
      </div>
      <ul
        role="list"
        class="grid max-w-2xl grid-cols-1 mx-auto mt-20 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
      >
        {#each data.members as member}
          <li>
            <img
              class="w-56 h-56 mx-auto rounded-full"
              src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
              alt=""
            />
            <h3
              class="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900"
            >
              {member.pubkey}
            </h3>
            <p class="text-sm leading-6 text-gray-600">Copywriter</p>
            <ul role="list" class="flex justify-center mt-6 gap-x-6">
              {#if member.socials?.twitter}
                <li>
                  <a href="#" class="text-gray-400 hover:text-gray-500">
                    <span class="sr-only">Twitter</span>
                    <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"
                      />
                    </svg>
                  </a>
                </li>
              {/if}
              {#if member.socials?.linkedin}
                <li>
                  <a href="#" class="text-gray-400 hover:text-gray-500">
                    <span class="sr-only">LinkedIn</span>
                    <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </a>
                </li>
              {/if}
            </ul>
          </li>
          <form method="POST" action="?/removeMember" use:enhance>
            <input type="hidden" name="pubkey" value={member.pubkey} />
            <button class="delete" type="submit">X</button>
          </form>
        {/each}
      </ul>
    </div>
  </div>
</ul>

<section>
  <form
    method="POST"
    action="?/addMember"
    use:enhance={addMember}
    enctype="multipart/form-data"
  >
    <!-- <input type="file" multiple id="image" name="image" accept="image/*" on:change={handleDisplayImage}/> -->
    {#if uploadedImage}
      <div>
        <img src={uploadedImage} style="max-width: 50ch;" alt="" />
      </div>
    {/if}
    <button aria-busy={loading} type="submit">
      {#if !loading}
        + Add Member
      {/if}
    </button>
    <button formaction="?/clearMembers" type="submit"> Clear </button>
  </form>

  <div class="flex justify-center w-full">
    <div class="w-2/3 bg-gray-50">
      <div
        class="flex flex-col justify-center min-h-full py-12 sm:px-6 lg:px-8"
      >
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            class="w-auto h-10 mx-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2
            class="mt-6 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900"
          >
            Sign in to your account
          </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div class="px-6 py-12 bg-white shadow sm:rounded-lg sm:px-12">
            <form
              class="space-y-6"
              method="POST"
              action="?/addMember"
              use:enhance={addMember}
              enctype="multipart/form-data"
            >
              <div>
                <label
                  for="pubkey"
                  class="block text-sm font-medium leading-6 text-gray-900"
                  >Wallet address</label
                >
                <div class="mt-2">
                  <input
                    type="text"
                    name="pubkey"
                    value={$walletStore.publicKey ?? ""}
                    autocomplete="on"
                    required
                    class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {#if form?.errors?.pubkey}
                    <p class="error">Pubkey is required</p>
                  {/if}
                </div>
              </div>

              <div>
                <label
                  for="username"
                  class="block text-sm font-medium leading-6 text-gray-900"
                  >Username</label
                >
                <div class="mt-2">
                  <input
                    type="text"
                    name="username"
                    value={form?.data?.username ?? ""}
                    autocomplete="on"
                    required
                    class="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {#if form?.errors?.username}
                    <p class="error">Username is required</p>
                  {/if}
                </div>
              </div>

              <div hidden>
                <input type="text" name="ip" value={data.clientAddress} />
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600"
                  />
                  <label
                    for="remember-me"
                    class="block ml-3 text-sm leading-6 text-gray-900"
                    >Remember me</label
                  >
                </div>

                <div class="text-sm leading-6">
                  <a
                    href="#"
                    class="font-semibold text-indigo-600 hover:text-indigo-500"
                    >Forgot password?</a
                  >
                </div>
              </div>

              <div>
                {#if !loading}
                  <button
                    aria-busy={loading}
                    type="submit"
                    class="w-full justify-center rounded-md bg-indigo-600 flex px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >Register</button
                  >
                {/if}
              </div>
            </form>

            <div>
              <div class="relative mt-10">
                <div
                  class="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div class="w-full border-t border-gray-200" />
                </div>
                <div
                  class="relative flex justify-center text-sm font-medium leading-6"
                >
                  <span class="px-6 text-gray-900 bg-white"
                    >Or continue with</span
                  >
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 mt-6">
                <a
                  href="#"
                  class="flex w-full items-center justify-center gap-3 rounded-md bg-[#1D9BF0] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0]"
                >
                  <svg
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"
                    />
                  </svg>
                  <span class="text-sm font-semibold leading-6">Twitter</span>
                </a>

                <a
                  href="#"
                  class="flex w-full items-center justify-center gap-3 rounded-md bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
                >
                  <svg
                    class="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="text-sm font-semibold leading-6">GitHub</span>
                </a>
              </div>
            </div>
          </div>

          <p class="mt-10 text-sm text-center text-gray-500">
            Not a member?
            <a
              href="#"
              class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >Start a 14 day free trial</a
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
