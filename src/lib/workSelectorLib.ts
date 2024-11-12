
export type WorkSelectorParam = {
    initialPersonId: number|null;
}

// 作品選択ダイアログのオープン
export const workSelectorOpen = (initialPersonId: number | null) => {
    const param: WorkSelectorParam = {
        initialPersonId
    };
    document.dispatchEvent(new CustomEvent('work-selector-dialog-open', { detail: param}))
}