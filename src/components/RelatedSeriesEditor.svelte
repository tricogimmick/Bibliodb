<script lang="ts">
    import type { RelatedSeriesType } from "../types/relatedSeries";
    import type { SeriesType } from "../types/series";

    type PropsType = {
        label: string;
        relatedType: string;
        relatedId: number | null;
        relatedSeries: RelatedSeriesType[];
        series: SeriesType[];
        isMedia: number;
        callback: (links: RelatedSeriesType[]) => void
    }
    type ItemType = {
        orderNo: number;
        seriesId: number | null;
        seriesIndex: string;
        description: string;
    }

    let { label, relatedType, relatedId, relatedSeries, series, isMedia, callback } : PropsType = $props();

    let _items: ItemType[] = relatedSeries.map((x, i) => {
        const s = series.find(z => z.id == x.seriesId);
        return ({
            orderNo: i + 1,
            seriesId: s?.id ?? null,
            seriesIndex: s?.index ?? '',
            description: x.description
        })
    });
    if (_items.length === 0) {
        _items.push({ orderNo: 1, seriesId: null, seriesIndex: '', description: '' });
    }
    let items: ItemType[] = $state(_items);

    let uuid = $state(crypto.randomUUID());

    // 新たな関連人物を生成
    const newRelatedSeries = (orderNo: number) => ({
        orderNo,
        seriesId: null,
        seriesIndex: '',
        description: ''
    });

    // 親コンポーネントのコールバックを呼び出す
    const callCallback = () => {
        const data: RelatedSeriesType[] = items.map(x => {
            const s = series.find(z => z.index === x.seriesIndex);
            return ({
                relatedType,
                relatedId,
                seriesId: s?.id ?? null,
                seriesTitle: s != null ? s.title : x.seriesIndex,
                isMedia,
                description: x.description            
            });
        });
        callback?.(data);
    }

   // 関連シリーズ名が変更された
   const onChangeRelatedSeriesTitle = (e: Event) => {
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
                seriesId: x.seriesId,
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
                seriesId: x.seriesId,
                seriesIndex: x.seriesIndex,
                description: x.description
            }));
            callCallback();
        }
    }
</script>
<datalist id="{uuid}">
    {#each series as p (p.id)}
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
        <input name="seriesTitle" type="text" bind:value={item.seriesIndex} list="{uuid}" onchange={onChangeRelatedSeriesTitle} />
        <input name="description" type="text" bind:value={item.description} onchange={callCallback} />
        <button onclick={onClickAddButton}>追加</button>               
        <button onclick={onClickDeleteButton}>削除</button>               
    </div>
</div>              
{/each}

