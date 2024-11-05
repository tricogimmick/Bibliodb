<script lang="ts">
    import type { PublisherType } from '../../../types/publisher';
    import type { ResultType } from '../../../types/result';

    import { goto } from "$app/navigation";
    import PublisherEditor from '../../../components/PublisherEditor.svelte';

    let publisher: PublisherType = {
        id: null,
        name: "",
        description: ""
    };

    const onSubmit = (result: ResultType<PublisherType>) => {
        if (result.ok) {
            goto("/publishers");
        } else {
            alert("データの登録に失敗しました。");
        }
    }

</script>

<h2>Publisher - Append</h2>
<PublisherEditor {...publisher} callback={onSubmit}></PublisherEditor>
<div class="footer">
    <a href="/publishers">Back to Publishers</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>