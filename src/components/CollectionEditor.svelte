<script lang="ts">
    import type { CollectionType } from '../types/collection';
    import type { SeriesType } from '../types/series';

    import { createSeriesType } from '../types/series';
    import { confirmDialog } from '../lib/client';

    type PropsType = {
        collection: CollectionType;
        series: SeriesType[];
        callback: ((data: CollectionType) => void | Promise<void>) | null
    };

    let { collection, series, callback } : PropsType = $props();

    let title = $state(collection.title);
    let seriesName = $state(series?.find(x => x.id === collection.seriesId)?.index ?? '');
    let issue = $state(collection.issue);
    let collectionType = $state(collection.collectionType);
    let description = $state(collection.description);
    let note = $state(collection.note);
    let buttonCaption = $derived(collection.id == null || collection.id == 0 ? '登　録' : '更　新')

    // シリーズとイシューからタイトルを組み立てる
    $effect(() => {
        title = [seriesName, issue].filter(x => x != null && x !== '').join(' ');
    });

    // サブミットされた
    const onSubmit = async (e: Event) => {
        const series_ = series.find((x) => x.index === seriesName) ?? createSeriesType(null, seriesName);

        const errors: string[] = [];
        if (series_.id == null && series_.index != '') {
            errors.push(`シリーズ：${series_.index}が未登録です.`);
        }
        if (errors.length > 0) {
            const errorMessage = errors.join('<br>');
            const confirmed = await confirmDialog(
                'マスタが存在しない項目があります。',
                `${errorMessage}<br>マスタが存在しない項目については新たに登録しますか？`
            );
            if (!confirmed) {
                return;
            }
        }

        e.stopImmediatePropagation();
        e.preventDefault();
        const data: CollectionType = {
            id: collection.id,
            title,
            seriesId: series_.id,
            issue,
            collectionType,
            description,
            note,
            series: series_,
        };
        callback?.(data);
    }
</script>

<div>
    <datalist id="C9C3E8B4-6C2E-4F5F-9A2E-2C7A6B8B6C7D">
        {#each series as s (s.id)}
        <option value={s.index}></option>
        {/each}
    </datalist>
    <form onsubmit={onSubmit}>
        <div class="input-field">
            <label for="title">タイトル</label>
            <input name="title" type="text" bind:value={title} required />
        </div>
        <div class="input-field">
            <label for="seriesName">シリーズ</label>
            <input name="seriesName" type="text" bind:value={seriesName} list="C9C3E8B4-6C2E-4F5F-9A2E-2C7A6B8B6C7D" />
        </div>
        <div class="input-field">
            <label for="issue">号数</label>
            <input name="issue" type="text" bind:value={issue} />
        </div>
        <div class="input-field">
            <label for="collectionType">種別</label>
            <select name="collectionType" bind:value={collectionType}>
                <option value="本のリスト">本のリスト</option>
                <option value="ブックレビュー">ブックレビュー</option>
            </select>
        </div>
        <div class="input-field">
            <label for="description">説明</label>
            <textarea name="description" bind:value={description} rows="5" cols="80"></textarea>
        </div>
        <div class="input-field">
            <label for="note">Note</label>
            <textarea name="note" bind:value={note} rows="5" cols="80"></textarea>
        </div>
        <div class="button-container">
            <input type="submit" value="{buttonCaption}" />
        </div>
    </form>
</div>
