<script lang="ts">
    import type { PageData } from './$types';
    import type { BrandType } from '../../../types/brand';

    import { goto } from "$app/navigation";
    import BrandEditor from '../../../components/BrandEditor.svelte';
    import { callApi } from '../../../lib/client'

    const { data }: { data: PageData } = $props();
    const brand : BrandType = data.brand as BrandType;

    const onSubmit = async (data: BrandType) => {
        const result = await callApi('/api/brands', 'PUT', data);
        if (result.ok) {
            goto("/brands");
        } else {
         alert(`Error! (${result.data})`);   
        }
    }
</script>


<h2>Brands - Edit</h2>
<BrandEditor {brand} callback={onSubmit}></BrandEditor>
<div class="footer">
    <a href="/brands">Back to Brands</a>
</div>
