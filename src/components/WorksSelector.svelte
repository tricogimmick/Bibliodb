<script lang="ts">
    import type { PersonType } from "../types/person";
    import type { WorkType } from "../types/work";
    import type { WorkSelectorParam } from "$lib/workSelectorLib";
    import { error } from '@sveltejs/kit';
    import { onMount } from 'svelte';

    type PropsType = {
        orderNo: number;
        callback: (orderNo: number, work: WorkType) => void;
    }
    let { orderNo, callback } : PropsType = $props();

    let persons: PersonType[] = $state([]);
    let targetPersonIndex = $state("");
    let targetPersonId = $derived(persons.find(x => x.index === targetPersonIndex)?.id ?? null);
    let filterWord = $state("");
    let _works: WorkType[] = [];
    let works: WorkType[] = $state([]);

    // APIの呼出
    async function callApi<T>(url: string) {
        const respoonse = await fetch(url);
        if (respoonse.ok) {
            const result: { ok: boolean, data: T } = await respoonse.json();
            if (!result.ok) {
                error(500, { message: "API Error" });
            } 
            return result.data;
        }
        error(500, { message: "API Error" });
    }

    // 作品情報の更新
    const updateWorks = async () => {
        try {
            _works = await callApi(targetPersonId != null ? `/api/works?pid=${targetPersonId}` : "/api/works");
            works = _works.filter(x => x.title.includes(filterWord));
        } catch (e: any) {
            console.log(e);
        }
    }

    // カスタムイベントのハンドラー
    const handleEventDialogOpen = ((event: CustomEvent<WorkSelectorParam>) => {
        targetPersonIndex = persons.find(x => x.id == event.detail.initialPersonId)?.index ?? "";
        updateWorks();
        const dialog = document.getElementById("FBBDB14D-D9F9-42E5-9199-93EE08F37816") as HTMLDialogElement;
        dialog.showModal();
        (document.querySelector('dialog input[name="filterWord"]') as HTMLInputElement).focus();
    }) as EventListenerOrEventListenerObject

    // 検索ボタンがクリックされた
    const onClickSearchButton = async (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        await updateWorks();
    }

    // フィルターが変更された
    const onInputFilterWord = (e: Event) => {
        works = _works.filter(x => x.title.includes(filterWord));
    }

    // キャンセルボタンがクリックされた
    const onClickDialogCancel = (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        const dialog = document.getElementById("FBBDB14D-D9F9-42E5-9199-93EE08F37816") as HTMLDialogElement;
        dialog.close();
    }

    // 作品リンクがクリックされた
    const onClickWorkLink = (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        const workId =((e.target as HTMLElement).closest("div") as HTMLElement).dataset.id ?? null;
        const work = _works.find(x => x.id === Number(workId));
        if (work) {
            callback?.(orderNo, work);
            const dialog = document.getElementById("FBBDB14D-D9F9-42E5-9199-93EE08F37816") as HTMLDialogElement;
            dialog.close();
        } else {
            alert("Work data not found!");
        }
    }

    // コンポーネントがマウントされた
    onMount(async () => {
        try {
            persons = await callApi<PersonType[]>("/api/persons");
        } catch (e: any) {
            console.log(e);
            alert(e);
        }
        document.addEventListener('work-selector-dialog-open', handleEventDialogOpen)
    });
</script>

<dialog id="FBBDB14D-D9F9-42E5-9199-93EE08F37816">
    <div>
        <datalist id="AAE546D9-D63C-455C-9555-A2414979A428">
            {#each persons as p (p.id)}
            <option value={p.index}></option>
            {/each}
        </datalist>
        <div class="input-field">
            <label for="targetPersonIndex">著作者</label>
            <input name="targetPersonIndex" type="text" bind:value={targetPersonIndex} list="AAE546D9-D63C-455C-9555-A2414979A428"/>
            <button onclick={onClickSearchButton}>検索</button>
        </div>
        <div class="input-field">
            <label for="filterWord">フィルタ</label>
            <input name="filterWord" type="text" bind:value={filterWord} oninput={onInputFilterWord} />
        </div>
        <div class="query-results">
            <div class="header">タイトル</div>
            {#each works as work (work.id)}
            <div class="row" data-id="{work.id}"><a class="work-link" href="." onclick={onClickWorkLink}>{work.title}{#if work.publicationYear}&nbsp;({work.publicationYear}){/if}</a></div>
            {/each}
        </div>
    </div>
        <div class="dialog-footer">
        <button onclick={onClickDialogCancel}>CANCEL</button>
    </div>
</dialog>


<style>
    input[name="targetPersonIndex"]+button {
        margin-left: 0.5rem;
    }
    .query-results {
        margin-top: 0.5rem;
        padding: 0;
        height: 20rem;  
        overflow-y: scroll;
    }
    .header {
        border-bottom: 1px solid gray;
    }
    .work-link {
        display: block;
        padding: 0.2rem 0.2rem;
        text-decoration: none;
        color: black;
    }
    .work-link:hover {
        text-decoration: none;
        background-color: gray;
        color: white;
    }
    .work-link:focus {
        text-decoration: none;
        outline: none;
    }
</style>