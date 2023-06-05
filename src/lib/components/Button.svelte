<script lang=ts>

    export let label : string;
    export let styling: string;
    export let onClick: () => Promise<any> | any = () => undefined;

    async function handleClick(){
        await onClick()
    }


</script>

<button class="p-2 bg-primary rounded-md {styling}" on:click={() => handleClick()}>
    {label}
</button>