<script lang="ts">
    import { goto } from "$app/navigation";
    import PersonEditor from '../../../components/PersonEditor.svelte';

    import type { PageData } from './$types';
    import type { PersonType  } from '../../../types/person';
    import type { ResultType } from '../../../types/result';


    const { data }: { data: PageData } = $props();
    const person : PersonType = data.persons as PersonType;
    $inspect(data);

    const onSubmit = (result: ResultType<PersonType>) => {
        if (result.ok) {
            goto("/persons");
        } else {
         alert("データの更新に失敗しました。");   
        }
    }
</script>


<h2>Person - Edit</h2>
<PersonEditor {...person} callback={onSubmit}></PersonEditor>
<div class="footer">
    <a href="/persons">Back to Persons</a>
</div>

<style>
    .footer {
        margin-top: 1rem;
    }
</style>