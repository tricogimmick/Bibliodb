<script lang="ts">
    import type { RelatedWorksType } from "../types/relatedWorks";
    import type { WorkType } from "../types/work";
    import type { ResultType } from "../types/result";

    type PropsType = {
        label: string;
        relatedType: string;
        subType: string;
        relatedId: number | null;
        relatedWorks: RelatedWorksType[];
        works: WorkType[];
        callback: (links: RelatedWorksType[]) => void
    }
    type ItemType = {
        orderNo: number;
        workIndex: string;
        description: string;
    }

    let { label, relatedType, subType, relatedId, relatedWorks, works, callback } : PropsType = $props();

    let _items: ItemType[] = relatedWorks.map((x, i) => ({
        orderNo: i + 1,
        workIndex: works.find(z => z.id == x.workId)?.index ?? "",
        description: x.description
    }));
    if (_items.length === 0) {
        _items.push({ orderNo: 1, workIndex: "", description: "" });
    }
    let items: ItemType[] = $state(_items);

    let uuid = $state(crypto.randomUUID());

    // 新たな関連作品を生成
    const newRelatedWorks = (orderNo: number) => ({
        orderNo,
        workIndex: "",
        description: ""
    });

    // 親コンポーネントのコールバックを呼び出す
    const callCallback = () => {
        const t: RelatedWorksType[] = items.map(x => ({
            relatedType,
            subType,
            relatedId,
            workId: works.find(z => z.index === x.workIndex)?.id ?? null,
            description: x.description            
        }));
        callback?.(t);
    }

   // 関連作品名が変更された
   const onChangeRelatedWorksIndex = (e: Event) => {
        const field = e.target as HTMLInputElement;
        if (field.value != "") {
            if (works.find(x => x.index === field.value) == null) {
                field.setCustomValidity("作品が存在しません")
            } else {
                field.setCustomValidity("")
            }
        } else {
            field.setCustomValidity("")
        }
        callCallback();
    }
 
    // 追加ボタンがクリックされた
    const onClickAddButton = (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        const orderNo = Number((e.target as HTMLButtonElement)?.closest("div")?.dataset.orderNo);
        if (items.length == orderNo) {
            items.push(newRelatedWorks(orderNo + 1));
        } else {
            const t = items.map(x => ({
                orderNo: x.orderNo > orderNo ? x.orderNo + 1 : x.orderNo,
                workIndex: x.workIndex,
                description: x.description
            }));
            t.push(newRelatedWorks(orderNo + 1));
            items = t.toSorted((a, b) => a.orderNo - b.orderNo);
        }
        callCallback();
    };

    // 削除ボタンがクリックされた
    const onClickDeleteButton = (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        if (items.length > 1) {
            const orderNo = Number((e.target as HTMLButtonElement)?.closest("div")?.dataset.orderNo);
            items = items.filter(x => x.orderNo != orderNo).map(x => ({  
                orderNo: x.orderNo > orderNo ? x.orderNo -1 : x.orderNo,
                workIndex: x.workIndex,
                description: x.description
            }));
            callCallback();
        }
    }
</script>
<datalist id="{uuid}">
    {#each works as p (p.id)}
        <option>{p.index}</option>
    {/each}
</datalist>
{#each items as item, i (item.orderNo)}
<div class="input-field">
    {#if i == 0}
    <label for="">{label}</label>
    {:else}
    <label for="">&nbsp</label>
    {/if}
    <div class="person-data" data-order-no={item.orderNo}>
        <input name="workIndex" type="text" bind:value={item.workIndex} list="{uuid}" onchange={onChangeRelatedWorksIndex} />
        <input name="description" type="text" bind:value={item.description} onchange={callCallback} />
        <button onclick={onClickAddButton}>追加</button>               
        <button onclick={onClickDeleteButton}>削除</button>               
    </div>
</div>              
{/each}

