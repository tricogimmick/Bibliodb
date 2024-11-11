<script lang="ts">
    import type { RelatedPeronsType } from "../types/relatedPersons";
    import type { PersonType } from "../types/person";

    type PropsType = {
        relatedType: string;
        relatedId: number | null;
        relatedPersons: RelatedPeronsType[];
        persons: PersonType[];
        callback: (links: RelatedPeronsType[]) => void
    }
    type ItemType = {
        orderNo: number;
        role: string;
        personName: string;
        description: string;
    }

    let { relatedType, relatedId, relatedPersons, persons, callback } : PropsType = $props();
    if (relatedPersons.length === 0) {
        relatedPersons.push({
            relatedType: relatedType,
            relatedId: null,
            orderNo: 1,
            personId: null,
            role: "作者",
            description: ""
        });
    }

    let _items: ItemType[] = relatedPersons.map((x, i) => ({
        orderNo: i + 1,
        role: x.role,
        personName: persons.find(z => z.id == x.personId)?.index ?? "",
        description: x.description
    }));
    let items = $state(_items);

    const newRelatedPerson: (orderNo: number) => ItemType = (orderNo: number) => ({
        orderNo,
        role: "作者",
        personName: "",
        description: ""
    });

    const callCallback = () => {
        const t: RelatedPeronsType[] = items.map(x => ({
            relatedType,
            relatedId,
            orderNo: x.orderNo,
            personId: persons.find(z => z.index === x.personName)?.id ?? null,
            role: x.role,
            description: x.description            
        }));
        callback?.(t);
    }

   // 関連人物名が変更された
   const onChangeRelatedPersonName = (e: Event) => {
        const field = e.target as HTMLInputElement;
        if (persons.find(x => x.index === field.value) == null) {
            field.setCustomValidity("著作者が存在しません")
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
            items.push(newRelatedPerson(orderNo + 1));
        } else {
            const t = items.map(x => ({
                orderNo: x.orderNo > orderNo ? x.orderNo + 1 : x.orderNo,
                role: x.role,
                personName: x.personName,
                description: x.description
            }));
            t.push(newRelatedPerson(orderNo + 1));
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
                role: x.role,
                personName: x.personName,
                description: x.description
            }));
            callCallback();
        }
    }
</script>

{#each items as item, i (item.orderNo)}
<div class="input-field">
    {#if i == 0}
    <label for="">著作者</label>
    {:else}
    <label for="">&nbsp</label>
    {/if}
    <div class="person-data" data-order-no={item.orderNo}>
        <select name="role" bind:value={item.role} onchange={callCallback}>
            <option value="作者">作者</option>
            <option value="著者">著者</option>
            <option value="翻訳者">翻訳者</option>
            <option value="編者">編者</option>
            <option value="話者">話者</option>
            <option value="解説">解説</option>
            <option value="原作者">原作者</option>
            <option value="作画">作画</option>
        </select>
        <input name="authorName" type="text" bind:value={item.personName} required list="persons" onchange={onChangeRelatedPersonName} />
        <button onclick={onClickAddButton}>追加</button>               
        <button onclick={onClickDeleteButton}>削除</button>               
    </div>
</div>              
{/each}

<style>
    select[name="role"] {
        width: 5rem;
        min-width: 5rem;
        margin-bottom: 0.2rem;
    }
</style>
