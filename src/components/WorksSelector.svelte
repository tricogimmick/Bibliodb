<script lang="ts">
    import type { PersonType } from "../types/person";
    import type { WorkType } from "../types/work";
    import type { RelatedPeronsType } from "../types/relatedPersons";
    import type { WorkSelectorParam } from "$lib/workSelectorLib";
    import { onMount } from "svelte";

    type PropsType = {
        orderNo: number;
        persons: PersonType[];
        works: WorkType[];
        relatedPersons: RelatedPeronsType[];
        callback: (orderNo: number, work: WorkType) => void;
    }
    let { orderNo, persons, works, relatedPersons, callback } : PropsType = $props();

    let targetPersonIndex = $state("");
    let targetPersonId = $derived(persons.find(x => x.index === targetPersonIndex)?.id ?? null);
    let filterWord = $state("");
    let filterdWorks: WorkType[] = $state([]);

    // 作品情報の更新
    const updateWorks = async () => {
        try {
            if (targetPersonId != null) {
                const workIds = relatedPersons.filter(x => x.personId == targetPersonId).map(x => x.relatedId as number);
                filterdWorks = works.filter(x => workIds.includes(x.id as number) && x.title.includes(filterWord));
            } else {
                filterdWorks = works.filter(x => x.title.includes(filterWord));
            }
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
        const input = (document.querySelector('dialog input[name="filterWord"]') as HTMLInputElement);
        input.focus();
        input.select();
    }) as EventListenerOrEventListenerObject

    // 検索ボタンがクリックされた
    const onClickSearchButton = async (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        await updateWorks();
    }

    // フィルターが変更された
    const onInputFilterWord = (e: Event) => {
        updateWorks();
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
        const work = works.find(x => x.id === Number(workId));
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
        document.addEventListener('work-selector-dialog-open', handleEventDialogOpen)
    });
</script>

<dialog  id="FBBDB14D-D9F9-42E5-9199-93EE08F37816">
    <div class="comtent">
        <datalist id="AAE546D9-D63C-455C-9555-A2414979A428">
            {#each persons as p (p.id)}
            <option value={p.index}></option>
            {/each}
        </datalist>
        <div class="dialog-header">
            <div class="input-field">
                <label for="targetPersonIndex">著作者</label>
                <input name="targetPersonIndex" type="text" bind:value={targetPersonIndex} list="AAE546D9-D63C-455C-9555-A2414979A428"/>
                <button onclick={onClickSearchButton}>検索</button>
            </div>
            <div class="input-field">
                <label for="filterWord">フィルタ</label>
                <input name="filterWord" type="text" bind:value={filterWord} oninput={onInputFilterWord} />
            </div>
        </div>
        <div class="detail-header">タイトル</div>
        <div class="details">
            {#each filterdWorks as work (work.id)}
            <div class="row" data-id="{work.id}"><a class="work-link" href="." onclick={onClickWorkLink}>{work.title}{#if work.publicationYear}&nbsp;({work.publicationYear}){/if}</a></div>
            {/each}
        </div>
        <div class="dialog-footer">
            <button onclick={onClickDialogCancel}>CANCEL</button>
        </div>    
    </div>
</dialog>


<style>
    .comtent {
        width: 600px;
        margin: 0;
        padding: 0;
    }
    .dialog-header {
        width: 100%;
        input[name="targetPersonIndex"]+button {
            margin-left: 0.5rem;
        }
    }
    .detail-header {
        width: 100%;
        border-bottom: 1px solid gray;
        margin-bottom: 0.5rem;
    }
    .details {
        margin: 0 0 1rem 0;
        padding: 0;
        width: 100%;
        height: 400px;
        overflow-y: scroll;
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
    }
    .dialog-footer {
        text-align: right;
        button {
            padding: 0.5rem 1rem
        }
    }

</style>