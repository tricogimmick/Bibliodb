<script lang="ts">
    import type { WorkType } from "../types/work";
    import type { PersonType } from "../types/person";
    import type { WorksPeronsType } from "../types/worksPersons";
    import type { ResultType } from "../types/result";
    import type { PostDataType } from "../routes/api/works/+server";

    type PropsType = {
        work: WorkType,
        worksPersons: WorksPeronsType[],
        persons: PersonType[],
        callback: ((result: ResultType<WorkType>) => void) | null
    };

    type AuthorEntryType = {
        orderNo: number;
        role: string;
        personId: number | null;
        personName: string;
        description: string;
    };

    let { work, worksPersons, persons, callback } : PropsType = $props();

    let title = $state(work.title);
    let originalTitle = $state(work.originalTitle);
    let contentType = $state(work.contentType);
    let description = $state(work.description);
    let url = $state(work.url);
    let note = $state(work.note);
    let buttonCaption = $derived(work.id == null || work.id == 0 ? "登　録" : "更　新")

    const rawAuthors: AuthorEntryType[] = worksPersons.map(x => ({
        orderNo: x.orderNo as number,
        role: x.role,
        personId: x.personId,
        personName: persons.find(p => p.id == x.personId)?.nameIndex ?? "",
        description: x.description
    }));
    let authors = $state(rawAuthors);

     // 登録
     const appendWork = async (postData: PostDataType) => {
        console.log(postData);
        const response = await fetch('/api/works', {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: {
                'content-type': 'application/json'
            }
        });
        return await response.json() as WorkType;
    }

    // 更新
    const updateWork = async (putData: PostDataType) => {
        console.log(putData);
        const response = await fetch('/api/works', {
            method: 'PUT',
            body: JSON.stringify(putData),
            headers: {
                'content-type': 'application/json'
            }
        });
        return await response.json() as WorkType;
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
                authors: authors.map(a => ({
                    orderNo: a.orderNo,
                    personId: persons.find(p => p.nameIndex === a.personName)?.id ?? 0,
                    role: a.role,
                    description: a.description
                }))
            };
            const result : WorkType = work.id != null ? await updateWork(postData) : await appendWork(postData);
            console.log(result);
            callback?.({
                ok: true,
                data: result
            });
        } catch (e: any) {
            callback?.({
                ok: false,
                data: null
            });
        }
    };

    const onClickAuthorAdd = (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        const orderNo = Number((e.target as HTMLButtonElement)?.closest("div")?.dataset.orderNo);
        console.log(`Order No: ${orderNo}`);
        if (authors.length == orderNo) {
            authors.push({
                orderNo: orderNo + 1,
                role: "作者",
                personId: null,
                personName: "",
                description: ""
            });
        } else {
            const t = authors.map(p => ({
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
            authors = t.toSorted((a, b) => a.orderNo - b.orderNo);
        }
    };

    const onClickAuthorDelete = (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        const orderNo = Number((e.target as HTMLButtonElement)?.closest("div")?.dataset.orderNo);
        console.log(`Order No: ${orderNo}`);
        authors = authors.filter(p => p.orderNo != orderNo).map(p => ({  
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

</script>

<div>
    <datalist id="persons">
        {#each persons as p (p.id)}
        <option value={p.nameIndex}></option>
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
        {#each authors as author, i (author.orderNo)}
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
                </select>
                <input name="authorName" type="text" bind:value={author.personName} required list="persons" onchange={onChangePersonName} />
                <button onclick={onClickAuthorAdd}>追加</button>               
                <button onclick={onClickAuthorDelete}>削除</button>               
            </div>
        </div>              
        {/each}
        <div class="input-field">
            <label for="description">解説</label>
            <textarea name="description" bind:value={description} rows="5" cols="80" ></textarea>
        </div>      
        <div class="input-field">
            <label for="url">URL</label>
            <input name="url" bind:value={url} type="url" />
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