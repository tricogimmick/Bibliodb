<script lang="ts">
    import type { PersonType } from '../types/person';
    import type { RelatedLinkType } from "../types/relatedLink";

    import RelatedLinkEditor from "./RelatedLinkEditor.svelte";
 
    type PropsType = {
        person: PersonType;
        callback: ((result: PersonType) => void | Promise<void>) | null;
    }

    let { person, callback }: PropsType = $props();
    let index = $state(person.index);
    let name = $state(person.name);
    let kana = $state(person.kana);
    let born = $state(person.born);
    let died = $state(person.died);
    let description = $state(person.description);
    let buttonCaption = $derived(person.id == null || person.id == 0 ? "ADD" : "UPDATE");

    let relatedLinks = $state(person.relatedLinks ?? []);
 
    // INDEXが変更された
    const onChangeIndex = (e: Event) => {
        name = index;
    }

    // 関連リンクが変更された
    const onChangeRelationLinks = (rl: RelatedLinkType[]) => {
        relatedLinks = rl;
    }

    // FOMRがサブミットされた
    const onSubmit = async (e: Event)  => {
        e.stopImmediatePropagation();
        e.preventDefault();
        const data: PersonType = { 
            id: person.id, 
            index, 
            name, 
            kana, 
            born, 
            died, 
            description,
            relatedLinks: relatedLinks?.filter(x => x.url != null && x.url != "").map<RelatedLinkType>(x => ({
                id: x.id,
                relatedType: x.relatedType,
                relatedId: x.relatedId,
                linkType: x.linkType,
                url: x.url,
                alt: x.alt,
                description: x.description
            })) ?? null
        };
        callback?.(data);
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