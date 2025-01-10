<script lang="ts">
    import type { MovieType } from "../types/movie";
    import type { SeriesType } from "../types/series";
    import type { RelatedPeronsType } from "../types/relatedPersons";
    import type { RelatedLinksType } from "../types/relatedLinks";
    import type { PostDataType } from "../routes/api/movies/+server";
    import type { ResultType } from "../types/result";
	import type { PersonType } from "../types/person";

    import RelatedPersonEditor from "./RelatedPersonEditor.svelte";
    import RelatedLinkEditor from "./RelatedLinkEditor.svelte";

    type PropsType = {
        movie: MovieType;
        relatedPersons: RelatedPeronsType[];
        relatedLinks: RelatedLinksType[];
        persons: PersonType[];
        series: SeriesType[];
        callback: ((result: ResultType<MovieType>) => void) | null
    };

    let { movie, relatedPersons, relatedLinks, series, persons, callback } : PropsType = $props();

    let title = $state(movie.title);
    let originalTitle = $state(movie.originalTitle);
    let seriesName = $state(series.find(x => x.id === movie.seriesId)?.index ?? "");
    let country = $state(movie.country);
    let releaseYear = $state(movie.releaseYear);
    let description = $state(movie.description);
    let note = $state(movie.note);
    let viewingDate = $state(movie.viewingDate);
    let viewingMethod = $state(movie.viewingMethod)
    let buttonCaption = $derived(movie.id == null || movie.id == 0 ? "登　録" : "更　新")

     // 更新用APIの呼出
     const callApi = async (postData: PostDataType, method: "POST" | "PUT") => {
        const response = await fetch('/api/movies', {
            method: method,
            body: JSON.stringify(postData),
            headers: {
                'content-type': 'application/json'
            }
        });
        if (response.ok) {
            return await response.json() as MovieType;
        } else {
            throw new Error(`Fetch Error:(${response.status})`)
        }
    }

    // サブミットされた
    const onSubmit = async (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        try {
            const postData: PostDataType = {
                id: movie.id,
                title,
                originalTitle,
                seriesId: series.find(x => x.index === seriesName)?.id ?? null,
                country,
                releaseYear,
                description,
                note,
                viewingDate,
                viewingMethod,              
                relatedPersons: relatedPersons.filter(x => x.personId != null).map(x => ({
                    orderNo: x.orderNo as number,
                    personId: x.personId as number,
                    role: x.role,
                    description: x.description
                })),
                relatedLinks: relatedLinks.filter(x => x.url != null && x.url != "").map(x => ({
                    linkType: x.linkType,
                    url: x.url,
                    alt: x.alt,
                    description: x.description
                })),
            };
            const result = await callApi(postData,movie.id != null ? "PUT" : "POST");
            console.log(result);
            callback?.({ ok: true, data: result });
        } catch (e: any) {
            callback?.({ ok: false, data: e });
        }
    }

    // シリーズ名が変更された
    const onChangeSeriesName = (e: Event) => {
        console.log(e.target);    
        const field = e.target as HTMLInputElement;
        if (field.value != null && field.value != "") {
            const s = series.find(x => x.index === field.value);
            if (s != null) {
                field.setCustomValidity("")
            } else {
                field.setCustomValidity("シリーズが存在しません")
            }
        } else {
            field.setCustomValidity("")
        }
    }

    // 関連人物リンクが変更された
    const onChangeRelationPersons = async (rp: RelatedPeronsType[]) => {
        relatedPersons = rp;
    }

    // 関連リンクが変更された
    const onChangeRelationLinks = (rl: RelatedLinksType[]) => {
        relatedLinks = rl;
    }

</script>

<div>
    <datalist id="435415A5-DA26-452F-94CE-BB538691CEC5">
        {#each series as s (s.id)}
        <option value={s.index}></option>
        {/each}
    </datalist>
    <datalist id="A4688825-4113-4502-9E51-3526FE7C18C4">
        <option value=”Netflix”></option>
        <option value="Amazon Prime Video"></option>
        <option value="U-Next"></option>
        <option value="映画館"></option>
    </datalist>
    <form onsubmit={onSubmit}>
        <div class="input-field">
            <label for="seriesName">シリーズ</label>
            <input name="seriesName" type="text" bind:value={seriesName} list="435415A5-DA26-452F-94CE-BB538691CEC5" onchange={onChangeSeriesName} />
        </div>              
        <div class="input-field">
            <label for="title">題名</label>
            <input name="title" type="text" bind:value={title} required />
            <span><label for="originalTitle">原題</label><input name="originalTitle" type="text" bind:value={originalTitle} /></span>
        </div>
        <div class="input-field">
            <label for="country">国</label>
            <input name="releaseYear" type="text" bind:value={country}  />
        </div>              
        <div class="input-field">
            <label for="releaseYear">公開年</label>
            <input name="releaseYear" type="text" bind:value={releaseYear}  />
        </div>              
        <RelatedPersonEditor relatedType="MOVIE" relatedId={movie.id} {relatedPersons} {persons} label="スタッフ・出演" callback={onChangeRelationPersons}></RelatedPersonEditor>
        <div class="input-field">
            <label for="description">解説</label>
            <textarea name="description" bind:value={description} rows="5" cols="80" ></textarea>
        </div>      
        <RelatedLinkEditor relatedType="MOVIE" relatedId={movie.id} {relatedLinks} callback={onChangeRelationLinks}></RelatedLinkEditor>
        <div class="input-field">
            <label for="note">Note</label>
            <textarea name="note" bind:value={note} rows="5" cols="80" ></textarea>
        </div>      
        <div class="input-field">
            <label for="viewingDate">視聴日</label>
            <input name="viewingDate" type="date" bind:value={viewingDate}  />
        </div>              
        <div class="input-field">
            <label for="viewingMethod">視聴方法</label>
            <input name="viewingMethod" type="text" bind:value={viewingMethod} list="A4688825-4113-4502-9E51-3526FE7C18C4"  />
        </div>              
        <div class="button-container">
            <input type="submit" value="{buttonCaption}" />
        </div>
    </form>
</div>

<style>
    .input-field input+span {
        margin-left: 0.5rem;
        label {
            margin: 0 0.2rem;
        }
        input {
            margin: 0 0.2rem;            
        }
    }
</style>