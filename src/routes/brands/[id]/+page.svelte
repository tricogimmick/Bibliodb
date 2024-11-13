<script lang="ts">
    import type { PageData } from './$types';
    import type { BrandType } from '../../../types/brand';
    import type { ResultType } from '../../../types/result';

    import { goto } from "$app/navigation";
    import BrandEditor from '../../../components/BrandEditor.svelte';


    const { data }: { data: PageData } = $props();
    const brand : BrandType = data.brand as BrandType;
    $inspect(data);

    const onSubmit = (result: ResultType<BrandType>) => {
        if (result.ok) {
            goto("/brands");
        } else {
         alert(`Error! (${result.data})`);   
        }
    }
</script>


<h2>Person - Edit</h2>
<BrandEditor {brand} callback={onSubmit}></BrandEditor>
<div class="footer">
    <a href="/brands">Back to Brands</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>