<script lang="ts">
    import type { RelatedLinksType } from "../types/relatedLinks";

    type PropsType = {
        relatedType: string;
        relatedId: number | null;
        relatedLinks: RelatedLinksType[];
        callback: (links: RelatedLinksType[]) => void
    }
    type ItemType = {
        orderNo: number;
        linkType: "IMG" | "LINK";
        url: string;
        alt: string;
        description: string;
    }

    let { relatedType, relatedId, relatedLinks, callback } : PropsType = $props();

    if (relatedLinks.length === 0) {
        relatedLinks.push({
            id: null,
            relatedType: relatedType,
            relatedId: relatedId,
            linkType: "IMG",
            url: "",
            alt: "aaaaa",
            description: ""
        });
    }

    let _items: ItemType[] = relatedLinks.map((x, i) => ({
        orderNo: i + 1,
        linkType: x.linkType,
        url: x.url,
        alt: x.alt,
        description: x.description
    }));
    let items = $state(_items);

    const newRelatedLink: (orderNo: number) => ItemType = (orderNo: number) => ({
        orderNo,
        linkType: "IMG",
        url: "",
        alt: "",
        description: ""
    });

    const callCallback = () => {
        const t: RelatedLinksType[] = items.map(x => ({
            id: null,
            relatedType,
            relatedId,
            linkType: x.linkType,
            url: x.url,
            alt: x.alt,
            description: x.description
        }));
        callback?.(t);
    }

    // 追加ボタンがクリックされた
    const onClickAddButton = (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        const orderNo = Number((e.target as HTMLButtonElement)?.closest("div")?.dataset.orderNo);
        if (items.length == orderNo) {
            items.push(newRelatedLink(orderNo + 1));
        } else {
            const t = items.map(x => ({
                orderNo: x.orderNo > orderNo ? x.orderNo + 1 : x.orderNo,
                linkType: x.linkType,
                url: x.url,
                alt: x.alt,
                description: x.description
            }));
            t.push(newRelatedLink(orderNo + 1));
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
                linkType: x.linkType,
                url: x.url,
                alt: x.alt,
                description: x.description
            }));
            callCallback();
        }
    }
</script>

{#each items as item, i (item.orderNo)}
<div class="input-field">
    {#if i == 0}
    <label for="">関連LINK</label>
    {:else}
    <label for="">&nbsp</label>
    {/if}
    <div class="related-link-data" data-order-no={item.orderNo}>
        <select name="linkType" bind:value={item.linkType} onchange={callCallback}>
            <option value="IMG">画像</option>
            <option value="LINK">リンク</option>
        </select>
        <input name="url" type="url" bind:value={item.url} required onchange={callCallback}/><br>
        <input name="alt" type="text" bind:value={item.alt} onchange={callCallback} />
        <button onclick={onClickAddButton}>追加</button>               
        <button onclick={onClickDeleteButton}>削除</button>               
    </div>
</div>
{/each}
