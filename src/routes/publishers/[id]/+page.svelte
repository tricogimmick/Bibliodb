<script lang="ts">
    import type { PageData } from './$types';
    import type { PublisherType } from "../../../types/publisher";
    import type { ResultType } from '../../../types/result';

    import { goto } from "$app/navigation";
    import PublisherEditor from '../../../components/PublisherEditor.svelte';

    const { data }: { data: PageData } = $props();
    const publisher : PublisherType = data.publisher as PublisherType;

    const onSubmit = (result: ResultType<PublisherType>) => {
        if (result.ok) {
            goto("/publishers");
        } else {
         alert("データの更新に失敗しました。");   
        }
    }
</script>

<h2>Person - Edit</h2>
<PublisherEditor {publisher} callback={onSubmit}></PublisherEditor>
<div class="footer">
    <a href="/publishers">Back to Publishers</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>