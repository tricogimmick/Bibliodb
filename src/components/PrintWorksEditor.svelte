<script lang="ts">
    import type { PrintsWorksType } from "../types/printsWorks";

    type PropsType = {
        printId: number | null;
        printWorks: PrintsWorksType[];
        callback: (works: PrintsWorksType[]) => void
    }

    type ItemType = {
        orderNo: number;
        worksId: number | null;
        title: string;
        subTitle: string;
        pageNo: number | null;
        publishType: string;
        serializationStatus: string;
        color: number | null;
        firstPublished: number | null;
        description: string;        
    }

    let { printId, printWorks, callback } : PropsType = $props();

    if (printWorks.length === 0) {
        printWorks.push({
            printId,
            orderNo: 1,
            worksId: null,
            subTitle: "",
            pageNo: null,
            publishType: "",
            serializationStatus: "",
            color: 0,
            firstPublished: 0,
            description: ""        
        });
    }

    let _items: ItemType[] = printWorks.map((x, i) => ({
        orderNo: i + 1,
        worksId: x.workId,
        title: "",
        subTitle: x.subTitle,
        pageNo: x.pageNo,
        publishType: x.publishType,
        serializationStatus: x.serializationStatus,
        color: x.color,
        firstPublished: x.firstPublished,
        description: x.description        
    }));
    let items = $state(_items);


</script>

<table>
    <thead>
        <tr>
            <th>No</th><th>タイトル</th><th>サブタイトル</th><th>頁</th><th>種別</th><th>連載</th><th>C</th><th>初</th><th>備考</th>
        </tr>
    </thead>
    <tbody>
        {#each items as item (item.orderNo)}
            <tr>
                <td>{item.orderNo}</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        {/each}
        <tr>
        </tr>
    </tbody>
</table>

<style>
    table {
        border-collapse:  collapse; 
        box-sizing: border-box;
    }
</style>