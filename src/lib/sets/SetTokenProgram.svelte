<script lang=ts>
    import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
    import type { PublicKey } from '@solana/web3.js';
    import Select from '../components/Select.svelte';

    let programs : PublicKey[] = [ TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID]

    export let programSelected : PublicKey = programs[0]
    export let onChange: () => Promise<any> | any = () => undefined;

</script>

<Select label='Token Program' options={programs} bind:bindValue={programSelected} onChange={onChange} />