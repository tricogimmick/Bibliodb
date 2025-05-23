<script lang="ts">
    import type { RelatedPeronsType } from "../types/relatedPersons";
    import type { PersonType } from "../types/person";
    import type { ResultType } from "../types/result";

    type PropsType = {
        relatedType: string;
        relatedId: number | null;
        relatedPersons: RelatedPeronsType[];
        persons: PersonType[];
        label: string;
        callback: (links: RelatedPeronsType[]) => void;
    }
    type ItemType = {
        orderNo: number;
        role: string;
        personName: string;
        description: string;
    }

    let { relatedType, relatedId, relatedPersons, persons, label, callback } : PropsType = $props();

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
        personName: persons.find(z => z.id === x.personId)?.name ?? "",
        description: x.description
    }))
    let items: ItemType[] = $state(_items);

    // 新たな関連人物を生成
    const newRelatedPerson: (orderNo: number, role: string) => ItemType = (orderNo: number, role: string) => ({
        orderNo,
        role: role ?? "作者",
        personName: "",
        description: ""
    });

    // 親コンポーネントのコールバックを呼び出す
    const callCallback = () => {
        const t: RelatedPeronsType[] = items.filter(x => x.personName != null && x.personName != "").map(x => ({
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
        if (field.value != null && field.value != "") {
            if (persons.find(x => x.index === field.value) == null) {
                field.setCustomValidity("著作者が存在しません")
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
        const personDataElm = (e.target as HTMLButtonElement)?.closest("div") as HTMLDivElement;
        const orderNo = Number(personDataElm.dataset.orderNo);
        const role = personDataElm.querySelector("select")?.value ?? "";
        if (items.length == orderNo) {
            items.push(newRelatedPerson(orderNo + 1, role));
        } else {
            const t = items.map(x => ({
                orderNo: x.orderNo > orderNo ? x.orderNo + 1 : x.orderNo,
                role: x.role,
                personName: x.personName,
                description: x.description
            }));
            t.push(newRelatedPerson(orderNo + 1, role));
            items = t.toSorted((a, b) => a.orderNo - b.orderNo);
        }
        callCallback();
    };

    // 削除ボタンがクリックされた
    const onClickDeleteButton = (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        if (items.length > 1) {
            const personDataElm = (e.target as HTMLButtonElement)?.closest("div") as HTMLDivElement;
            const orderNo = Number(personDataElm.dataset.orderNo);
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
<datalist id="6EFEFD7E-E5D7-4166-BA08-A3C4B7C62D89">
    {#each persons as p (p.id)}
        <option>{p.index}</option>
    {/each}
</datalist>
{#each items as item, i (item.orderNo)}
<div class="input-field">
    {#if i == 0}
    <label for="">{label ?? "著作者"}</label>
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
            <option value="聞き手">聞き手</option>
            <option value="解説">解説</option>
            <option value="原作者">原作者</option>
            <option value="原案">原案</option>
            <option value="作画">作画</option>
            <option value="協力">協力</option>
            <option value="監修">監修</option>
            <option value="監督">監督</option>
            <option value="アクション監督">アクション監督</option>
            <option value="作画監督">作画監督</option>
            <option value="脚本">脚本</option>
            <option value="出演">出演</option>
        </select>
        <input name="authorName" type="text" bind:value={item.personName} list="6EFEFD7E-E5D7-4166-BA08-A3C4B7C62D89" onchange={onChangeRelatedPersonName} />
        <button onclick={onClickAddButton}>追加</button>               
        <button onclick={onClickDeleteButton}>削除</button>               
    </div>
</div>              
{/each}

<style>
    select[name="role"] {
        width: 10rem;
        min-width: 5rem;
        margin-bottom: 0.2rem;
    }
</style>
