<script lang="ts">
    import type { WorkType } from "../types/work";
    import type { PersonType } from "../types/person";
    import type { RelatedPeronsType } from "../types/relatedPersons";
    import type { ResultType } from "../types/result";
    import type { PostDataType } from "../routes/api/works/+server";

    type PropsType = {
        work: WorkType,
        relatedPersons: RelatedPeronsType[],
        persons: PersonType[],
        callback: ((result: ResultType<WorkType>) => void) | null
    };

    type RelatedPerssonEntryType = {
        orderNo: number;
        role: string;
        personId: number | null;
        personName: string;
        description: string;
    };

    let { work, relatedPersons, persons, callback } : PropsType = $props();

    let title = $state(work.title);
    let originalTitle = $state(work.originalTitle);
    let contentType = $state(work.contentType);
    let description = $state(work.description);
    let url = $state(work.url);
    let note = $state(work.note);
    let publicationYear = $state(work.publicationYear);
    let seqNo = $state(work.seqNo);
    let buttonCaption = $derived(work.id == null || work.id == 0 ? "登　録" : "更　新")

    const _relatedPersons: RelatedPerssonEntryType[] = relatedPersons.map(x => ({
        orderNo: x.orderNo as number,
        role: x.role,
        personId: x.personId,
        personName: persons.find(p => p.id == x.personId)?.index ?? "",
        description: x.description
    }));
    let relatedPersonEntries = $state(_relatedPersons);

     // 更新用APIの呼出
     const callApi = async (postData: PostDataType, method: "POST" | "PUT") => {
        const response = await fetch('/api/works', {
            method: method,
            body: JSON.stringify(postData),
            headers: {
                'content-type': 'application/json'
            }
        });
        if (response.ok) {
            return await response.json() as WorkType;
        } else {
            throw new Error(`Fetch Error:(${response.status})`)
        }
    }
    // FOMRがサブミットされた
    const onSubmit = async (e: Event)  => {
        console.log("onSubmit()");
        e.stopImmediatePropagation();
        e.preventDefault();

        try {
            const postData: PostDataType = {
                id: work.id,
                title,
                originalTitle,
                contentType,
                description,
                url,
                note,
                publicationYear,
                seqNo,
                relatedPersons: relatedPersonEntries.map(a => ({
                    orderNo: a.orderNo,
                    personId: persons.find(p => p.index === a.personName)?.id ?? 0,
                    role: a.role,
                    description: a.description
                }))
            };
            const result = await callApi(postData, work.id != null ? "PUT" : "POST");
            console.log(result);
            callback?.({ ok: true, data: result });
        } catch (e: any) {
            callback?.({ ok: false, data: e });
        }
    };

    // 関係者追加ボタンがクリックされた
    const onClickRelatedPersonAdd = (e: Event) => {
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

    // 関係者削除ボタンがクリックされた
    const onClickRelatedPersonDelete = (e: Event) => {
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
    const onChangeRelatedPersonName = (e: Event) => {
        const field = e.target as HTMLInputElement;
        if (persons.find(x => x.index === field.value) == null) {
            field.setCustomValidity("著作者が存在しません")
        } else {
            field.setCustomValidity("")
        }
    }

</script>

<div>
    <datalist id="persons">
        {#each persons as p (p.id)}
        <option value={p.index}></option>
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
            <label for="contentType">種別</label>
            <select name="contentType" bind:value={contentType}>
                <option value="小説">小説</option>
                <option value="エッセイ">エッセイ</option>
                <option value="評論">評論</option>
                <option value="対談・座談">対談・座談</option>
            </select>
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
                <input name="authorName" type="text" bind:value={author.personName} required list="persons" onchange={onChangeRelatedPersonName} />
                <button onclick={onClickRelatedPersonAdd}>追加</button>               
                <button onclick={onClickRelatedPersonDelete}>削除</button>               
            </div>
        </div>              
        {/each}
        <div class="input-field">
            <label for="publishYear">発表年</label>
            <input name="publicationYear" type="number" bind:value={publicationYear}  min="1800" max="2100"/>
        </div>
        <div class="input-field">
            <label for="description">解説</label>
            <textarea name="description" bind:value={description} rows="5" cols="80" ></textarea>
        </div>      
        <div class="input-field">
            <label for="url">URL</label>
            <input name="url" bind:value={url} type="url" />
        </div>      
        <div class="input-field">
            <label for="seqNo">連番</label>
            <input name="seqNo" type="number" bind:value={seqNo} max="99999999" />
        </div>
        <div class="input-field">
            <label for="note">補記</label>
            <textarea name="note" bind:value={note} rows="5" cols="80" ></textarea>
        </div>      
        <div class="button-container">
            <input type="submit" value="{buttonCaption}" />
        </div>
    </form>
</div>