<script lang="ts">
    import type { RelatedSeriesType } from "../types/relatedSeries";
    import type { SeriesType } from "../types/series";
    import type { ResultType } from "../types/result";

    type PropsType = {
        relatedType: string;
        relatedId: number | null;
        relatedSeries: RelatedSeriesType[];
        series: SeriesType[];
        callback: (links: RelatedSeriesType[]) => void
    }
    type ItemType = {
        orderNo: number;
        seriesIndex: string;
        description: string;
    }

    let { relatedType, relatedId, relatedSeries, series, callback } : PropsType = $props();

    if (relatedSeries.length === 0) {
        relatedSeries.push({
            relatedType: relatedType,
            relatedId: null,
            seriesId: null,
            description: ""
        });
    }

    let _items: ItemType[] = relatedSeries.map((x, i) => ({
        orderNo: i + 1,
        seriesIndex: series.find(z => z.id == x.seriesId)?.index ?? "",
        description: x.description
    }));
    let items: ItemType[] = $state(_items);

    // 新たな関連人物を生成
    const newRelatedSeries = (orderNo: number) => ({
        orderNo,
        seriesIndex: "",
        description: ""
    });

    // 親コンポーネントのコールバックを呼び出す
    const callCallback = () => {
        const t: RelatedSeriesType[] = items.map(x => ({
            relatedType,
            relatedId,
            seriesId: series.find(z => z.index === x.seriesIndex)?.id ?? null,
            description: x.description            
        }));
        callback?.(t);
    }

   // 関連シリーズ名が変更された
   const onChangeRelatedSeriesTitle = (e: Event) => {
        const field = e.target as HTMLInputElement;
        if (series.find(x => x.index === field.value) == null) {
            field.setCustomValidity("シリーズが存在しません")
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
            items.push(newRelatedSeries(orderNo + 1));
        } else {
            const t = items.map(x => ({
                orderNo: x.orderNo > orderNo ? x.orderNo + 1 : x.orderNo,
                seriesIndex: x.seriesIndex,
                description: x.description
            }));
            t.push(newRelatedSeries(orderNo + 1));
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
                seriesIndex: x.seriesIndex,
                description: x.description
            }));
            callCallback();
        }
    }
</script>
<datalist id="9A5B2108-E5B9-407D-8D7C-F241E27C787A">
    {#each series.filter(x => x.seriesType !== "叢書") as p (p.id)}
        <option>{p.index}</option>
    {/each}
</datalist>
{#each items as item, i (item.orderNo)}
<div class="input-field">
    {#if i == 0}
    <label for="">掲載誌</label>
    {:else}
    <label for="">&nbsp</label>
    {/if}
    <div class="person-data" data-order-no={item.orderNo}>
        <input name="seriesTitle" type="text" bind:value={item.seriesIndex} list="9A5B2108-E5B9-407D-8D7C-F241E27C787A" onchange={onChangeRelatedSeriesTitle} />
        <input name="description" type="text" bind:value={item.description} onchange={callCallback} />
        <button onclick={onClickAddButton}>追加</button>               
        <button onclick={onClickDeleteButton}>削除</button>               
    </div>
</div>              
{/each}

