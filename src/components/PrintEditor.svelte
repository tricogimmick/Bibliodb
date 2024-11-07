<script lang="ts">
    import type { PrintType } from "../types/print";
    import type { PublisherType } from "../types/publisher";
    import type { SeriesType } from "../types/series";
    import type { PersonType } from "../types/person";
    import type { RelatedPeronsType } from "../types/relatedPersons";
    import type { PostDataType } from "../routes/api/prints/+server";
    import type { ResultType } from "../types/result";

    type PropsType = {
        print: PrintType,
        relatedPersons: RelatedPeronsType[],
        persons: PersonType[],
        publishers: PublisherType[],
        series: SeriesType[],
        callback: ((result: ResultType<PrintType>) => void) | null
    };

    type RelatedPersonEntryType = {
        orderNo: number;
        role: string;
        personId: number | null;
        personName: string;
        description: string;
    };

    let { print, relatedPersons, persons, publishers, series, callback } : PropsType = $props();

    let title = $state(print.title);
    let originalTitle = $state(print.originalTitle);
    let printType = $state(print.printType);
    let publisherName = $state(publishers.find(x => x.id === print.publisherId)?.name ?? "");
    let publicationDate = $state(print.publicationDate);
    let seriesName = $state(series.find(x => x.id === print.seriesId)?.nameIndex ?? "");
    let description = $state(print.description);
    let ndl = $state(print.ndl);
    let ownedType = $state(print.ownedType);
    let buttonCaption = $derived(print.id == null || print.id == 0 ? "登　録" : "更　新")

    const _relatedPersons: RelatedPersonEntryType[] = relatedPersons.map(x => ({
        orderNo: x.orderNo as number,
        role: x.role,
        personId: x.personId,
        personName: persons.find(p => p.id == x.personId)?.nameIndex ?? "",
        description: x.description
    }));
    let relatedPersonEntries = $state(_relatedPersons);

     // 登録
     const appendPrint = async (postData: PostDataType) => {
        console.log(postData);
        const response = await fetch('/api/prints', {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: {
                'content-type': 'application/json'
            }
        });
        if (response.ok) {
            return await response.json() as PrintType;
        } else {
            throw new Error(`Fetch Error:(${response.status})`)
        }
    }

    // 更新
    const updatePrint = async (putData: PostDataType) => {
        console.log(putData);
        const response = await fetch('/api/prints', {
            method: 'PUT',
            body: JSON.stringify(putData),
            headers: {
                'content-type': 'application/json'
            }
        });
        if (response.ok) {
            return await response.json() as PrintType;
        } else {
            throw new Error(`Fetch Error:(${response.status})`)
        }
    }

    const onSubmit = async (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        try {
            const postData: PostDataType = {
                id: print.id,
                title,
                originalTitle,
                printType,
                publisherId: publishers.find(x => x.name === publisherName)?.id ?? null,
                publicationDate,
                seriesId: series.find(x => x.nameIndex === seriesName)?.id ?? null,
                description,
                ndl,
                ownedType,
                relatedPersons: relatedPersonEntries.map(a => ({
                    orderNo: a.orderNo,
                    personId: persons.find(p => p.nameIndex === a.personName)?.id ?? 0,
                    role: a.role,
                    description: a.description
                }))
            };
            const result : PrintType = print.id != null ? await updatePrint(postData) : await appendPrint(postData);
            console.log(result);
            callback?.({
                ok: true,
                data: result
            });
        } catch (e: any) {
            callback?.({
                ok: false,
                data: e
            });
        }
    }

    const onChangeSeriesName = (e: Event) => {
        console.log(e.target);    
        const field = e.target as HTMLInputElement;
        if (field.value != null && field.value != "" && series.find(x => x.nameIndex === field.value) == null) {
            field.setCustomValidity("シリーズが存在しません")
        } else {
            field.setCustomValidity("")
        }
    }

    const onClickAuthorAdd = (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        const orderNo = Number((e.target as HTMLButtonElement)?.closest("div")?.dataset.orderNo);
        console.log(`Order No: ${orderNo}`);
        if (relatedPersonEntries.length == orderNo) {
            relatedPersonEntries.push({
                orderNo: orderNo + 1,
                role: "作者",
                personId: null,
                personName: "",
                description: ""
            });
        } else {
            const t = relatedPersonEntries.map(p => ({
                orderNo: p.orderNo > orderNo ? p.orderNo + 1 : p.orderNo,
                role: p.role,
                personId: p.personId,
                personName: p.personName,
                description: p.description
            }));
            t.push({
                orderNo: orderNo + 1,
                role: "作者",
                personId: null,
                personName: "",
                description: ""
            });
            relatedPersonEntries = t.toSorted((a, b) => a.orderNo - b.orderNo);
        }
    };

    const onClickAuthorDelete = (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        const orderNo = Number((e.target as HTMLButtonElement)?.closest("div")?.dataset.orderNo);
        console.log(`Order No: ${orderNo}`);
        relatedPersonEntries = relatedPersonEntries.filter(p => p.orderNo != orderNo).map(p => ({  
            orderNo: p.orderNo > orderNo ? p.orderNo -1 : p.orderNo,
                role: p.role,
                personId: p.personId,
                personName: p.personName,
                description: p.description
        }));
    }

    // 著作者名が変更された
    const onChangePersonName = (e: Event) => {
        console.log(e.target);    
        const field = e.target as HTMLInputElement;
        if (persons.find(x => x.nameIndex === field.value) == null) {
            field.setCustomValidity("著作者が存在しません")
        } else {
            field.setCustomValidity("")
        }
    }

    const onChangePublisherName = (e: Event) => {
        console.log(e.target);    
        const field = e.target as HTMLInputElement;
        if (publishers.find(x => x.name === field.value) == null) {
            field.setCustomValidity("出版社が存在しません")
        } else {
            field.setCustomValidity("")
        }
    }

</script>

<div>
    <datalist id="publishers">
        {#each publishers as p (p.id)}
        <option value={p.name}></option>
        {/each}
    </datalist>
    <datalist id="series">
        {#each series as s (s.id)}
        <option value={s.nameIndex}></option>
        {/each}
    </datalist>
    <form onsubmit={onSubmit}>
        <div class="input-field">
            <label for="title">題名</label>
            <input name="title" type="text" bind:value={title} required />
        </div>
        <div class="input-field">
            <label for="originalTitle">原題</label>
            <input name="originalTitle" type="text" bind:value={originalTitle} />
        </div>
        <div class="input-field">
            <label for="printType">出版種別</label>
            <select name="printType" bind:value={printType}>
                <option value="書籍">書籍</option>
                <option value="雑誌">雑誌</option>
            </select>
        </div>
        <div class="input-field">
            <label for="seriesName">シリーズ</label>
            <input name="seriesName" type="text" bind:value={seriesName} list="series" onchange={onChangeSeriesName} />
        </div>              
        {#each relatedPersonEntries as author, i (author.orderNo)}
        <div class="input-field">
            {#if i == 0}
            <label for="">著作者</label>
            {:else}
            <label for="">&nbsp</label>
            {/if}
            <div class="person-data" data-order-no={author.orderNo}>
                <select name="role" bind:value={author.role}>
                    <option value="作者">作者</option>
                    <option value="著者">著者</option>
                    <option value="翻訳者">翻訳者</option>
                    <option value="編者">編者</option>
                    <option value="話者">話者</option>
                    <option value="解説">解説</option>
                    <option value="原作者">原作者</option>
                    <option value="作画">作画</option>
                </select>
                <input name="authorName" type="text" bind:value={author.personName} required list="persons" onchange={onChangePersonName} />
                <button onclick={onClickAuthorAdd}>追加</button>               
                <button onclick={onClickAuthorDelete}>削除</button>               
            </div>
        </div>              
        {/each}
        <div class="input-field">
            <label for="publisherName">出版社</label>
            <input name="publisherName" type="text" bind:value={publisherName} list="publishers" required onchange={onChangePublisherName}/>
        </div>              
        <div class="input-field">
            <label for="publicationDate">発行日</label>
            <input name="publicationDate" type="date" bind:value={publicationDate}  />
        </div>              
        <div class="input-field">
            <label for="description">解説</label>
            <textarea name="description" bind:value={description} rows="5" cols="80" ></textarea>
        </div>      
        <div class="input-field">
            <label for="ndl">NDL Link</label>
            <input name="ndl" type="url" bind:value={ndl}  />
        </div>      
        <div class="input-field">
            <label for="ownedType">所有種別</label>
            <select name="ownedType" bind:value={ownedType}>
                <option value="">&nbsp;</option>
                <option value="所有">所有</option>
                <option value="PDF">PDF</option>
            </select>
        </div>
        <div class="button-container">
            <input type="submit" value="{buttonCaption}" />
        </div>
    </form>
</div>