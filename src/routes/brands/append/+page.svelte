<script lang="ts">
    import type { BrandType } from '../../../types/brand';
    import type { ResultType } from '../../../types/result';

    import { goto } from "$app/navigation";
    import BrandEditor from '../../../components/BrandEditor.svelte';

    let brand: BrandType = {
        id: null,
        name: "",
        description: ""
    };

    const onSubmit = (result: ResultType<BrandType>) => {
        if (result.ok) {
            goto("/brands");
        } else {
            alert("データの登録に失敗しました。");
        }
    }

</script>

<h2>Brands - Append</h2>
<BrandEditor {...brand} callback={onSubmit}></BrandEditor>
<div class="footer">
    <a href="/brands">Back to Brands</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>