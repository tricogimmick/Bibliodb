<script lang="ts">
    import type { ContentType } from "../types/content";
	import type { PersonType } from "../types/person";
	import type { WorkType } from "../types/work";
    import type { RelatedPeronsType } from "../types/relatedPersons";
    import WorksSelector from "./WorksSelector.svelte";
    import { workSelectorOpen } from "$lib/workSelectorLib";

    type PropsType = {
        printId: number | null;
        contents: ContentType[];
        relatedPersons: RelatedPeronsType[];
        persons: PersonType[];
        works: WorkType[];
        worksRelatedPersons: RelatedPeronsType[];
        filterdWorks: WorkType[];
        callback: (contents: ContentType[]) => void
    }

    type ItemType = {
        orderNo: number;
        workId: number | null;
        existWork: boolean;
        title: string;
        subTitle: string;
        pageNo: number | null;
        publishType: string;
        serializationStatus: string;
        color: boolean;
        firstPublished: boolean;
        description: string;        
    }

    let { printId, contents, relatedPersons, persons, works, worksRelatedPersons, filterdWorks, callback } : PropsType = $props();

    const newItem: (oderNo: number) => ItemType = (orderNo: number) => ({
        orderNo,
        workId: null,
        existWork: false,
        title: "",
        subTitle: "",
        pageNo: null,
        publishType: "",
        serializationStatus: "",
        color: false,
        firstPublished: true,
        description: ""        
    });

    let _items: ItemType[];
    if (contents?.length > 0) {
        _items = contents.map((x, i) => ({
            orderNo: i + 1,
            workId: x.workId,
            existWork: x.workId != null ? true : false,
            title: x.workId != null ? works.find(z => z.id === x.workId)?.title ?? "" : x.title,
            subTitle: x.subTitle,
            pageNo: x.pageNo,
            publishType: x.publishType,
            serializationStatus: x.serializationStatus,
            color: x.color == 1,
            firstPublished: x.firstPublished == 1,
            description: x.description        
        }));   
    } else {
        _items = [newItem(1)];
    }
    let items = $state(_items);

    let targetOrderNo = $state(0);
    
    // 作品選択からのコールバック
    const workSelectDialogCallback = (orderNo: number, work: WorkType) => {
        const item = items.find(x => x.orderNo === orderNo);
        if (item) {
            item.workId = work.id;
            item.existWork = true;
            item.title = work.index;
            callCallback();
        }
    }

    // 親コンポーネントのコールバックを呼び出す
    const callCallback = () => {
        const t: ContentType[] = items.filter(x => x.title != null).map(x => ({
            printId,
            orderNo: x.orderNo,
            workId: x.workId,
            title: x.title,
            subTitle: x.subTitle,
            pageNo: x.pageNo,
            publishType: x.publishType,
            serializationStatus: x.serializationStatus,
            color: x.color ? 1 : 0,
            firstPublished: x.firstPublished ? 1 : 0,
            description: x.description       
        }));
        callback?.(t);
    }

    // 追加ボタンがクリックされた
    const onClickAddButton = (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        const orderNo = Number(((e.target as HTMLButtonElement).closest("div.table-works-row") as HTMLElement).dataset.orderNo);
        if (items.length == orderNo) {
            items.push(newItem(orderNo + 1));
        } else {
            const t = items.map(x => ({
                orderNo: x.orderNo > orderNo ? x.orderNo + 1 : x.orderNo,
                workId: x.workId,
                existWork: x.existWork,
                title: x.title,
                subTitle: x.subTitle,
                pageNo: x.pageNo,
                publishType: x.publishType,
                serializationStatus: x.serializationStatus,
                color: x.color,
                firstPublished: x.firstPublished,
                description: x.description        
            }));
            t.push(newItem(orderNo + 1));
            items = t.toSorted((a, b) => a.orderNo - b.orderNo);
        }
        callCallback();
    };

    // 削除ボタンがクリックされた
    const onClickDeleteButton = (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        if (items.length > 1) {
            const orderNo = Number(((e.target as HTMLButtonElement).closest("div.table-works-row") as HTMLElement).dataset.orderNo);
            items = items.filter(x => x.orderNo != orderNo).map(x => ({  
                orderNo: x.orderNo > orderNo ? x.orderNo -1 : x.orderNo,
                workId: x.workId,
                existWork: x.existWork,
                title: x.title,
                subTitle: x.subTitle,
                pageNo: x.pageNo,
                publishType: x.publishType,
                serializationStatus: x.serializationStatus,
                color: x.color,
                firstPublished: x.firstPublished,
                description: x.description        
            }));
            callCallback();
        }
    };

    // タイトルが変更された
    const onChangeTitle = (e: Event) => {
        const field = e.target as HTMLInputElement;
        const orderNo = Number(((e.target as HTMLInputElement).closest("div.table-works-row") as HTMLElement).dataset.orderNo);
        const item = items.find(x => x.orderNo === orderNo) as ItemType;

        if (field.value != null && field.value != "") {
            const work = works.find(x => x.index === field.value);
            if (work == null) {
                item.workId = null;
                item.existWork = false;
            } else {
                item.workId = work.id;
                item.existWork = true;
                if (work.status === "連載中") {
                    item.publishType = "連載";
                    item.serializationStatus = "連載中";
                } else if (work.status === "読切") {
                    item.publishType = "読切";
                }
            }
        } else {
            item.workId = null;
            item.existWork = false;
        }
        callCallback();
    }

    // 検索ボタンがクリックされた
    const onClickSearchButton = (e: Event) => {
        e.stopImmediatePropagation();
        e.preventDefault();
        targetOrderNo = Number(((e.target as HTMLButtonElement).closest("div.table-works-row") as HTMLElement).dataset.orderNo);
        workSelectorOpen(relatedPersons.length > 0 ? relatedPersons[0].personId : null);
    }
</script>

<div class="table-works">
    <datalist id="A3F6CC9A-A102-4723-85EE-B395582ED634">
        {#each filterdWorks as work }
            <option>{work.index}</option>
        {/each}
    </datalist>
    <div class="table-works-header">
        <div class="table-works-row">
            <div class="table-works-column">No</div>
            <div class="table-works-column">タイトル</div>
            <div class="table-works-column">サブタイトル</div>
            <div class="table-works-column">頁</div>
            <div class="table-works-column">種別</div>
            <div class="table-works-column">連載</div>
            <div class="table-works-column">カラー</div>
            <div class="table-works-column">初出</div>
            <div class="table-works-column">備考</div>
            <div class="table-works-column">&nbsp;</div>
        </div>
    </div>
    <div class="table-works-body">
        {#each items as item (item.orderNo)}
        <div class="table-works-row" data-order-no={item.orderNo}>
            <div class="table-works-column">{item.orderNo}</div>
            <div class="table-works-column">
                <input type="checkbox" name="existWork" bind:checked={item.existWork} onchange={callCallback} />
                <input type="text" name="title" bind:value={item.title} list="A3F6CC9A-A102-4723-85EE-B395582ED634" onchange={onChangeTitle} />
                <button onclick={onClickSearchButton}>検索</button>
            </div>
            <div class="table-works-column">
                <input type="text" name="subtitle" bind:value={item.subTitle} onchange={callCallback} />
            </div>
            <div class="table-works-column">
                <input type="number" name="pageNo" bind:value={item.pageNo}  onchange={callCallback} /><span>頁</span>
            </div>
            <div class="table-works-column">
                <select name="publishType" bind:value={item.publishType} onchange={callCallback} >
                    <option value=""></option>
                    <option value="読切り">読切り</option>
                    <option value="連載">連載</option>
                    <option value="出張掲載">出張掲載</option>
                </select>
            </div>
            <div class="table-works-column">
                <select name="serializationStatus" bind:value={item.serializationStatus} onchange={callCallback} >
                    <option value=""></option>
                    <option value="新連載">新連載</option>
                    <option value="連載中">連載中</option>
                    <option value="最終回">最終回</option>
                </select>
            </div>
            <div class="table-works-column">
                <input type="checkbox" name="color" bind:checked={item.color} onchange={callCallback} />
            </div>
            <div class="table-works-column">
                <input type="checkbox" name="firstPublished" bind:checked={item.firstPublished} onchange={callCallback}  />
            </div>
            <div class="table-works-column">
                <input type="text" name="description" bind:value={item.description} onchange={callCallback}  />
            </div>
            <div class="table-works-column">
                <button onclick={onClickAddButton} >追加</button>               
                <button onclick={onClickDeleteButton}>削除</button>                       
            </div>
        </div>
        {/each}
    </div>
</div>
<WorksSelector orderNo={targetOrderNo} {persons} {works} relatedPersons={worksRelatedPersons} callback={workSelectDialogCallback}></WorksSelector>

<style>
    .table-works-header {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        > .table-works-row {
            display: grid;
            margin: 0;
            padding: 0;
            grid-template-columns: 2rem 6rem 8rem 8rem 4rem 4rem 30rem 5rem;
            grid-template-rows: 1.5rem 1.5rem;
        }
    }
    .table-works-body {
        box-sizing: border-box;
        margin: 0 0 1rem 0;
        padding: 0;
        > .table-works-row {
            display: grid;
            margin: 0;
            padding: 0;
            grid-template-columns: 2rem 6rem 8rem 8rem 4rem 4rem 30rem 5rem;
            grid-template-rows: 2.2rem 2rem;
        }
    }
    .table-works-column:nth-child(1) {
        grid-column: 1;
        grid-row: 1/3;
        text-align: center;
        padding: 0.3rem 0 0.3rem 0;
        border-bottom: 1px solid gray;
    }
    .table-works-column:nth-child(2) {
        grid-column: 2 / 7;
        grid-row: 1;
        padding: 0.3rem 0 0 0.3rem;
        > input[type="text"] {
            min-width: none;
            width: 23rem;
        }
    }
    .table-works-column:nth-child(3) {
        grid-column: 7;
        grid-row: 1;
        padding: 0.3rem 0 0 0.3rem;
        > input {
            min-width: none;
            width: 28rem;
        }
    }
    .table-works-column:nth-child(4) {
        grid-column: 2;
        grid-row: 2;
        padding: 0 0 0 0.3rem;
        border-bottom: 1px solid gray;
        > input {
            min-width: none;
            width: 3rem;
            text-align: right;
        }
        > input+span {
            margin-left: 0.2rem;
        }
    }
    .table-works-column:nth-child(5) {
        grid-column: 3;
        grid-row: 2;
        padding: 0 0 0 0.3rem;
        border-bottom: 1px solid gray;
        > select {
            min-width: none;
            width: 95%;
        }
    }
    .table-works-column:nth-child(6) {
        grid-column: 4;
        grid-row: 2;
        padding: 0 0 0.3rem 0.3rem;
        border-bottom: 1px solid gray;
        > select {
            min-width: none;
            width: 95%;
        }
    }
    .table-works-column:nth-child(7) {
        grid-column: 5;
        grid-row: 2;
        text-align: center;
        padding: 0 0 0.3rem 0;
        border-bottom: 1px solid gray;
        > input {
            margin-top: 0.3rem;
        }
    }
    .table-works-column:nth-child(8) {
        grid-column: 6;
        grid-row: 2;
        text-align: center;
        padding: 0 0 0.3rem 0;
        border-bottom: 1px solid gray;
        > input {
            margin-top: 0.3rem;
        }
    }
    .table-works-column:nth-child(9) {
        grid-column: 7;
        grid-row: 2;
        border-bottom: 1px solid gray;
        padding: 0 0 0 0.3rem;
        > input {
            min-width: none;
            width: 28rem;
        }
    }
    .table-works-column:nth-child(10) {
        grid-column: 8;
        grid-row: 1 / 3;
        text-align: center;
        padding: 0 0 0.3rem 0;
        border-bottom: 1px solid gray;
        > button {
            margin-top: 0.3rem;
            width: 5rem;
        }
    }    
</style>