<script lang="ts">
    import type { WorkType } from "../types/work";
    import type { PersonType } from "../types/person";
    import type { RelatedPeronsType } from "../types/relatedPersons";
    import type { RelatedLinksType } from "../types/relatedLinks";
    import type { ResultType } from "../types/result";
    import type { PostDataType } from "../routes/api/works/+server";

    import RelatedPersonEditor from "./RelatedPersonEditor.svelte";
    import RelatedLinkEditor from "./RelatedLinkEditor.svelte";

    type PropsType = {
        work: WorkType,
        relatedPersons: RelatedPeronsType[],
        relatedLinks: RelatedLinksType[],
        persons: PersonType[],
        callback: ((result: ResultType<WorkType>) => void) | null
    };

    let { work, relatedPersons, relatedLinks, persons, callback } : PropsType = $props();

    let title = $state(work.title);
    let originalTitle = $state(work.originalTitle);
    let contentType = $state(work.contentType);
    let description = $state(work.description);
    let note = $state(work.note);
    let publicationYear = $state(work.publicationYear);
    let seqNo = $state(work.seqNo);
    let finishedReading = $state(work.finishedReading);
    let buttonCaption = $derived(work.id == null || work.id == 0 ? "登　録" : "更　新")

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
                note,
                publicationYear,
                seqNo,
                finishedReading,
                relatedPersons: relatedPersons.map(x => ({
                    orderNo: x.orderNo as number,
                    personId: x.personId as number,
                    role: x.role,
                    description: x.description
                })),
                relatedLinks: relatedLinks.map(x => ({
                    linkType: x.linkType,
                    url: x.url,
                    alt: x.alt,
                    description: x.description
                }))
            };
            const result = await callApi(postData, work.id != null ? "PUT" : "POST");
            console.log(result);
            callback?.({ ok: true, data: result });
        } catch (e: any) {
            callback?.({ ok: false, data: e });
        }
    };

    // 著作者名が変更された
    const onChangeRelatedPersonName = (e: Event) => {
        const field = e.target as HTMLInputElement;
        if (persons.find(x => x.index === field.value) == null) {
            field.setCustomValidity("著作者が存在しません")
        } else {
            field.setCustomValidity("")
        }
    }

    // 関連人物リンクが変更された
    const onChangeRelationPersons = (rp: RelatedPeronsType[]) => {
        relatedPersons = rp;
    }

    // 関連リンクが変更された
    const onChangeRelationLinks = (rl: RelatedLinksType[]) => {
        relatedLinks = rl;
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
        <RelatedPersonEditor relatedType="WORK" relatedId={work.id} {relatedPersons} {persons} callback={onChangeRelationPersons}></RelatedPersonEditor>
        <div class="input-field">
            <label for="publishYear">発表年</label>
            <input name="publicationYear" type="number" bind:value={publicationYear}  min="1800" max="2100"/><span>年</span>
        </div>
        <div class="input-field">
            <label for="description">解説</label>
            <textarea name="description" bind:value={description} rows="5" cols="80" ></textarea>
        </div>      
        <div class="input-field">
            <label for="seqNo">連番</label>
            <input name="seqNo" type="number" bind:value={seqNo} max="99999999" />
        </div>
        <RelatedLinkEditor relatedType="WORK" relatedId={work.id} {relatedLinks} callback={onChangeRelationLinks}></RelatedLinkEditor>
        <div class="input-field">
            <label for="finishedReading">読了日</label>
            <input name="finishedReading" type="date" bind:value={finishedReading} />
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

<style>
    input[name="publicationYear"] {
        min-width: 4rem;
        width: 4rem;
        text-align: right;
    }
    input[name="publicationYear"]+span {
        margin-left: 0.5rem;
        padding-top: 0.1rem;
    }
    input[name="seqNo"] {
        min-width: 4rem;
        width: 4rem;
        text-align: right;
    }
</style>