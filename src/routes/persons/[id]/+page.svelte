<script lang="ts">
    import type { PageData } from './$types';
    import type { PersonType  } from '../../../types/person';
    import type { ResultType } from '../../../types/result';

    import { goto } from "$app/navigation";
    import PersonEditor from '../../../components/PersonEditor.svelte';

    const { data }: { data: PageData } = $props();
    const person = data.persons as PersonType;

    const onSubmit = (result: ResultType<PersonType>) => {
        if (result.ok) {
            goto("/persons");
        } else {
         alert("データの更新に失敗しました。");   
        }
    }
</script>

<h2>Person - Edit</h2>
<PersonEditor {person} callback={onSubmit}></PersonEditor>
<div class="footer">
    <a href="/persons">Back to Persons</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>