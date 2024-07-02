<script lang="ts">
  export let label: string;
  export let styling: string = "";
  export let type: ButtonType = "button";
  export let onClick: () => Promise<any> | any = () => undefined;

  type ButtonType = "button" | "submit" | "reset" | null | undefined;
  let handleClick = async () => {
    await onClick();
  };
</script>

<button
  {type}
  class={`p-2 rounded-md ${styling === "" ? "bg-primary" : styling}`}
  on:click={() => handleClick()}
>
  {label}
</button>
