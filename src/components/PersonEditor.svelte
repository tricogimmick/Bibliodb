<script lang="ts">
    import type { PersonType } from '../types/person';
    import type { ResultType } from '../types/result';
    import type { RelatedLinksType } from "../types/relatedLinks";
    import type { PostDataType } from "../routes/api/persons/+server";


    import RelatedLinkEditor from "./RelatedLinkEditor.svelte";
 
    type PropsType = {
        person: PersonType;
        relatedLinks: RelatedLinksType[],
        callback: (result: ResultType<PersonType>) => void | null;
    }

    let { person, relatedLinks, callback }: PropsType = $props();
    let index = $state(person.index);
    let name = $state(person.name);
    let kana = $state(person.kana);
    let born = $state(person.born);
    let died = $state(person.died);
    let description = $state(person.description);
    let buttonCaption = $derived(person.id == null || person.id == 0 ? "登　録" : "更　新");
 
    // INDEXが変更された
    const onChangeIndex = (e: Event) => {
        name = index;
    }

    // 関連リンクが変更された
    const onChangeRelationLinks = (rl: RelatedLinksType[]) => {
        relatedLinks = rl;
    }

    // 更新用APIの呼出
    const callApi = async (postData: PostDataType, method: "POST" | "PUT") => {
        const response = await fetch('/api/persons', {
            method: method,
            body: JSON.stringify(postData),
            headers: {
                'content-type': 'application/json'
            }
        });
        if (response.ok) {
            return await response.json() as ResultType<PersonType>;
        } else {
            throw new Error(`Fetch Error (${response.status})`)
        }
    }

    // FOMRがサブミットされた
    const onSubmit = async (e: Event)  => {
        console.log("onSubmit()");
        e.stopImmediatePropagation();
        e.preventDefault();
        try {
            const postData: PostDataType = { 
                id: person.id, 
                index, 
                name, 
                kana, 
                born, 
                died, 
                description,
                relatedLinks: relatedLinks.filter(x => x.url != null && x.url != "").map(x => ({
                    linkType: x.linkType,
                    url: x.url,
                    alt: x.alt,
                    description: x.description
                }))
            };
            const result: ResultType<PersonType> = await callApi(postData, person.id != null ? "PUT" : "POST");
            callback?.(result);
        } catch (e: any) {
            callback?.({ ok: false, data: (e as Error).message });
        }
    }
</script>

<div>
    <form onsubmit={onSubmit}>
        <div class="input-field">
            <label for="index">INDEX</label>
            <input name="index" type="text" bind:value={index} onchange={onChangeIndex} required />
        </div>
        <div class="input-field">
            <label for="name">氏名</label>
            <input name="name" type="text" bind:value={name} required />
        </div>
        <div class="input-field">
            <label for="kana">よみがな</label>
            <input name="kana" type="text" bind:value={kana} required />
        </div>
        <div class="input-field">
            <label for="born">生年月日</label>
            <input name="born" type="date" bind:value={born}  />
        </div>
        <div class="input-field">
            <label for="died">没年月日</label>
            <input name="died" type="date" bind:value={died}  />
        </div>
        <div class="input-field">
            <label for="description">解説</label>
            <textarea name="description" bind:value={description} rows="5" cols="80" ></textarea>
        </div>      
        <RelatedLinkEditor relatedType="PERSON" relatedId={person.id} {relatedLinks} callback={onChangeRelationLinks}></RelatedLinkEditor>
        <div class="button-container">
            <input type="submit" value="{buttonCaption}" />
        </div>
    </form>
</div>