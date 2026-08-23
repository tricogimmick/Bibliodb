<script lang="ts">
    import type { RelatedCollectionType } from "../types/relatedCollection";
    import type { CollectionType } from "../types/collection";

    type PropsType = {
        label: string;
        relatedType: string;
        relatedId: number | null;
        relatedCollections: RelatedCollectionType[];
        collections: CollectionType[];
        callback: (links: RelatedCollectionType[]) => void
    }
    type ItemType = {
        orderNo: number;
        collectionId: number | null;
        collectionTitle: string;
        description: string;
    }

    let { label, relatedType, relatedId, relatedCollections, collections, callback } : PropsType = $props();

    let _items: ItemType[] = relatedCollections.map((x, i) => {
        const c = collections.find(z => z.id == x.collectionId);
        return ({
            orderNo: i + 1,
            collectionId: c?.id ?? null,
            collectionTitle: c?.title ?? '',
            description: x.description
        })
    });
    if (_items.length === 0) {
        _items.push({ orderNo: 1, collectionId: null, collectionTitle: '', description: '' });
    }
    let items: ItemType[] = $state(_items);

    let uuid = $state(crypto.randomUUID());

    // 新たな関連コレクションを生成
    const newRelatedCollection = (orderNo: number) => ({
        orderNo,
        collectionId: null,
        collectionTitle: '',
        description: ''
    });

    // 親コンポーネントのコールバックを呼び出す
    const callCallback = () => {
        const data: RelatedCollectionType[] = items.map(x => {
            const c = collections.find(z => z.title === x.collectionTitle);
            return ({
                relatedType,
                relatedId,
                collectionId: c?.id ?? null,
                collectionTitle: c != null ? c.title : x.collectionTitle,
                description: x.description
            });
        });
        callback?.(data);
    }

    // 関連コレクション名が変更された
    const onChangeRelatedCollectionTitle = (e: Event) => {
        callCallback();
    }

    // 追加ボタンがクリックされた
    const onClickAddButton = (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        const orderNo = Number((e.target as HTMLButtonElement)?.closest("div")?.dataset.orderNo);
        if (items.length == orderNo) {
            items.push(newRelatedCollection(orderNo + 1));
        } else {
            const t = items.map(x => ({
                orderNo: x.orderNo > orderNo ? x.orderNo + 1 : x.orderNo,
                collectionId: x.collectionId,
                collectionTitle: x.collectionTitle,
                description: x.description
            }));
            t.push(newRelatedCollection(orderNo + 1));
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
                collectionId: x.collectionId,
                collectionTitle: x.collectionTitle,
                description: x.description
            }));
            callCallback();
        }
    }
</script>
<datalist id="{uuid}">
    {#each collections as c (c.id)}
        <option>{c.title}</option>
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
        <input name="collectionTitle" type="text" bind:value={item.collectionTitle} list="{uuid}" onchange={onChangeRelatedCollectionTitle} />
        <input name="description" type="text" bind:value={item.description} onchange={callCallback} />
        <button onclick={onClickAddButton}>追加</button>
        <button onclick={onClickDeleteButton}>削除</button>
    </div>
</div>
{/each}
