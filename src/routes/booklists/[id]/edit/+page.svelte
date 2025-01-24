<script lang="ts">
    import type { PageData } from './$types';
    import type { BookListType } from '../../../../types/bookList';
    import type { ResultType } from '../../../../types/result';

    import { goto } from "$app/navigation";
    import BookListEditor from '../../../../components/BookListEditor.svelte';

    const { data }: { data: PageData } = $props();
    const onSubmit = (result: ResultType<BookListType>) => {
        if (result.ok) {
            goto(`/booklists`);
        } else {
            alert("データの登録に失敗しました。");
        }
    }

</script>

<h2>Print - Edit</h2>
<BookListEditor {...data} callback={onSubmit}></BookListEditor>
<div class="footer">
    <a href="/booklists">Back to Book List</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>