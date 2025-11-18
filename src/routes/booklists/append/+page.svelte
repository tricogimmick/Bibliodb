<script lang="ts">
    import type { PageData } from './$types';
    import type { BookListType } from '../../../types/bookList';
    import type { ResultType } from '../../../types/result';

    import { goto } from "$app/navigation";
    import { page } from '$app/stores';
    import BookListEditor from '../../../components/BookListEditor.svelte';

    const { data }: { data: PageData } = $props();

    let bookList: BookListType = {
        id: null,
        dataType: "review",
        seriesId: null,
        issue: "",
        title: "",
        authors: "",
        publisher: "",
        url: "",
        description: ""
    };

    const onSubmit = (result: ResultType<BookListType>) => {
        if (result.ok) {
            goto("/booklists");
        } else {
            alert("データの登録に失敗しました。");
        }
    }

</script>

<h2>Book List - Append</h2>
<BookListEditor {bookList} {...data} callback={onSubmit}></BookListEditor>
<div class="footer">
    <a href="/booklists">Back to Book Lists</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>