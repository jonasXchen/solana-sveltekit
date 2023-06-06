<script lang=ts>

    export let label : string;
    export let styling: string = '';
    export let onClick: () => Promise<any> | any = () => undefined;

    async function handleClick() : Promise<any>{
        await onClick()
    }

</script>

<button class={`p-2 rounded-md ${styling === '' ? 'bg-primary' : styling}`} on:click={() => handleClick()}>
    {label}
</button>